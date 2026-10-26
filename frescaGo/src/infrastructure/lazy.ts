import type {
  AuthService,
  ImageStorage,
  OrderRepository,
  UserRepository,
} from "../application/ports";

const once = <T>(load: () => Promise<T>): (() => Promise<T>) => {
  let pending: Promise<T> | undefined;
  return () => (pending ??= load());
};

export const lazyAuthService = (
  load: () => Promise<AuthService>
): AuthService => {
  const service = once(load);
  return {
    signIn: async (email, password) =>
      (await service()).signIn(email, password),
    register: async (email, password) =>
      (await service()).register(email, password),
    signOut: async () => (await service()).signOut(),
    setPhoto: async (url) => (await service()).setPhoto(url),
    onChange: (listener) => {
      let active = true;
      let unsubscribe = () => {};
      service().then((loaded) => {
        if (active) {
          unsubscribe = loaded.onChange(listener);
        }
      });
      return () => {
        active = false;
        unsubscribe();
      };
    },
  };
};

export const lazyUserRepository = (
  load: () => Promise<UserRepository>
): UserRepository => {
  const repository = once(load);
  return {
    get: async (uid) => (await repository()).get(uid),
    create: async (user) => (await repository()).create(user),
    update: async (uid, changes) => (await repository()).update(uid, changes),
  };
};

export const lazyOrderRepository = (
  load: () => Promise<OrderRepository>
): OrderRepository => {
  const repository = once(load);
  return {
    list: async (email) => (await repository()).list(email),
    add: async (email, order) => (await repository()).add(email, order),
  };
};

export const lazyImageStorage = (
  load: () => Promise<ImageStorage>
): ImageStorage => {
  const storage = once(load);
  return {
    upload: async (file) => (await storage()).upload(file),
  };
};
