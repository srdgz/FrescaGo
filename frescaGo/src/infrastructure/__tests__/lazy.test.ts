import { describe, expect, it, vi } from "vitest";
import type { AuthService } from "../../application/ports";
import {
  lazyAuthService,
  lazyImageStorage,
  lazyOrderRepository,
  lazyUserRepository,
} from "../lazy";

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

const fakeAuth = (): AuthService => ({
  signIn: vi.fn().mockResolvedValue(undefined),
  register: vi.fn().mockResolvedValue("uid-1"),
  signOut: vi.fn().mockResolvedValue(undefined),
  setPhoto: vi.fn().mockResolvedValue(undefined),
  onChange: vi.fn().mockReturnValue(vi.fn()),
});

describe("lazy adapters", () => {
  it("do not load anything until they are used", () => {
    const load = vi.fn();
    lazyAuthService(load);
    lazyUserRepository(load);
    lazyOrderRepository(load);
    lazyImageStorage(load);

    expect(load).not.toHaveBeenCalled();
  });

  it("load once and forward every call to the real adapter", async () => {
    const real = fakeAuth();
    const load = vi.fn().mockResolvedValue(real);
    const auth = lazyAuthService(load);

    await auth.signIn("a@b.co", "secret123");
    await expect(auth.register("a@b.co", "secret123")).resolves.toBe("uid-1");
    await auth.setPhoto("photo.png");
    await auth.signOut();

    expect(load).toHaveBeenCalledTimes(1);
    expect(real.signIn).toHaveBeenCalledWith("a@b.co", "secret123");
    expect(real.setPhoto).toHaveBeenCalledWith("photo.png");
    expect(real.signOut).toHaveBeenCalled();
  });

  it("share one load between simultaneous calls", async () => {
    const real = fakeAuth();
    const gate = deferred<AuthService>();
    const load = vi.fn().mockReturnValue(gate.promise);
    const auth = lazyAuthService(load);

    const calls = [auth.signIn("a@b.co", "x"), auth.signOut()];
    gate.resolve(real);
    await Promise.all(calls);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it("pass errors from the real adapter through", async () => {
    const real = fakeAuth();
    vi.mocked(real.signIn).mockRejectedValue(new Error("wrong-password"));
    const auth = lazyAuthService(async () => real);

    await expect(auth.signIn("a@b.co", "x")).rejects.toThrow("wrong-password");
  });

  it("subscribe to auth changes once loaded and unsubscribe for real", async () => {
    const stop = vi.fn();
    const real = fakeAuth();
    vi.mocked(real.onChange).mockReturnValue(stop);
    const auth = lazyAuthService(async () => real);
    const listener = vi.fn();

    const unsubscribe = auth.onChange(listener);
    await vi.waitFor(() => expect(real.onChange).toHaveBeenCalledWith(listener));
    unsubscribe();

    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("never subscribe when the listener left before the adapter loaded", async () => {
    const real = fakeAuth();
    const gate = deferred<AuthService>();
    const auth = lazyAuthService(() => gate.promise);

    const unsubscribe = auth.onChange(vi.fn());
    unsubscribe();
    gate.resolve(real);
    await gate.promise;
    await Promise.resolve();

    expect(real.onChange).not.toHaveBeenCalled();
  });

  it("forward user, order and image calls", async () => {
    const users = {
      get: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn().mockResolvedValue(undefined),
    };
    const orders = {
      list: vi.fn().mockResolvedValue([]),
      add: vi.fn().mockResolvedValue(undefined),
    };
    const images = { upload: vi.fn().mockResolvedValue("https://img/a.png") };

    const lazyUsers = lazyUserRepository(async () => users);
    const lazyOrders = lazyOrderRepository(async () => orders);
    const lazyImages = lazyImageStorage(async () => images);

    await lazyUsers.get("uid-1");
    await lazyUsers.update("uid-1", { phone: "600" });
    await lazyOrders.list("a@b.co");
    const file = new File(["x"], "a.png");

    expect(await lazyImages.upload(file)).toBe("https://img/a.png");
    expect(users.get).toHaveBeenCalledWith("uid-1");
    expect(users.update).toHaveBeenCalledWith("uid-1", { phone: "600" });
    expect(orders.list).toHaveBeenCalledWith("a@b.co");
    expect(images.upload).toHaveBeenCalledWith(file);
  });
});
