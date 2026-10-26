import type { CartItem } from "../domain/cart";
import type { Currency } from "../domain/currency";
import type { Locale } from "../domain/locale";
import {
  OrderOwnerMismatchError,
  orderFromConfirmation,
} from "../domain/order";
import type { Order } from "../domain/order";
import { normalizeShippingAddress } from "../domain/user";
import type {
  ProfileForm,
  Registration,
  ShippingDetails,
  User,
} from "../domain/user";
import type {
  AuthService,
  CatalogGateway,
  CheckoutGateway,
  ImageStorage,
  OrderRepository,
  RatesGateway,
  UserRepository,
} from "./ports";

export interface Dependencies {
  catalog: CatalogGateway;
  rates: RatesGateway;
  auth: AuthService;
  users: UserRepository;
  orders: OrderRepository;
  images: ImageStorage;
  checkout: CheckoutGateway;
}

export const makeUseCases = ({
  catalog,
  rates,
  auth,
  users,
  orders,
  images,
  checkout,
}: Dependencies) => ({
  listFeatured: (locale: Locale) => catalog.getFeatured(locale),
  listCategories: (locale: Locale) => catalog.getCategories(locale),
  listProducts: (locale: Locale) => catalog.getProducts(locale),
  getProduct: (id: string, locale: Locale) => catalog.getProduct(id, locale),
  getExchangeRate: () => rates.getRate(),

  signIn: (email: string, password: string) => auth.signIn(email, password),
  signOut: () => auth.signOut(),
  observeAuth: (listener: (uid: string | undefined) => void) =>
    auth.onChange(listener),
  loadUser: (uid: string) => users.get(uid),

  async register(
    { firstName, lastName, email, password }: Registration,
    avatar: File | null
  ): Promise<void> {
    const uid = await auth.register(email, password);
    const avatarUrl = avatar ? await images.upload(avatar) : null;
    await users.create({
      id: uid,
      firstName,
      lastName,
      email,
      avatar: avatarUrl,
    });
  },

  async updateProfile(
    user: User,
    form: ProfileForm,
    avatar: File | null
  ): Promise<void> {
    const avatarUrl = avatar ? await images.upload(avatar) : form.avatar;
    await auth.setPhoto(avatarUrl);
    await users.update(user.id, {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone.trim(),
      shippingAddress: normalizeShippingAddress(form),
      avatar: avatarUrl,
    });
  },

  listOrders: (email: string) => orders.list(email),

  async confirmOrder(
    user: User,
    sessionId: string
  ): Promise<{ order: Order; alreadySaved: boolean }> {
    const confirmation = await checkout.confirm(sessionId);
    if (confirmation.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new OrderOwnerMismatchError();
    }
    const order = orderFromConfirmation(confirmation, user);
    const saved = await orders.list(user.email);
    const alreadySaved = saved.some(
      (existing) => existing.paymentId === order.paymentId
    );
    if (!alreadySaved) {
      await orders.add(user.email, order);
    }
    return { order, alreadySaved };
  },

  startCheckout: (
    items: CartItem[],
    email: string,
    options: { currency: Currency; locale: Locale; shipping: ShippingDetails }
  ) => checkout.start(items, email, options),
});

export type UseCases = ReturnType<typeof makeUseCases>;
