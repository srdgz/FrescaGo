import type { CartItem } from "../domain/cart";
import type { Order } from "../domain/order";
import type { ProfileForm, Registration, User } from "../domain/user";
import type {
  AuthService,
  CatalogGateway,
  CheckoutGateway,
  ImageStorage,
  OrderRepository,
  UserRepository,
} from "./ports";

export interface Dependencies {
  catalog: CatalogGateway;
  auth: AuthService;
  users: UserRepository;
  orders: OrderRepository;
  images: ImageStorage;
  checkout: CheckoutGateway;
}

export const makeUseCases = ({
  catalog,
  auth,
  users,
  orders,
  images,
  checkout,
}: Dependencies) => ({
  listFeatured: () => catalog.getFeatured(),
  listCategories: () => catalog.getCategories(),
  listProducts: () => catalog.getProducts(),
  getProduct: (id: string) => catalog.getProduct(id),

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
      address: form.address,
      phone: form.phone,
      avatar: avatarUrl,
    });
  },

  listOrders: (email: string) => orders.list(email),

  saveOrder: (user: User, paymentId: string, items: CartItem[]) => {
    const order: Order = {
      userEmail: user.email,
      paymentId,
      orderItems: items,
      paymentMethod: "stripe",
      userId: user.id,
    };
    return orders.add(user.email, order);
  },

  startCheckout: (items: CartItem[], email: string) =>
    checkout.start(items, email),
});

export type UseCases = ReturnType<typeof makeUseCases>;
