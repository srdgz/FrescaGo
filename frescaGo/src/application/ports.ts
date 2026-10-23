import type { CartItem } from "../domain/cart";
import type { Category, FeaturedProduct, Product } from "../domain/catalog";
import type { Order } from "../domain/order";
import type { User } from "../domain/user";

export interface CatalogGateway {
  getFeatured(): Promise<FeaturedProduct[]>;
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
}

export interface AuthService {
  signIn(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<string>;
  signOut(): Promise<void>;
  setPhoto(url: string): Promise<void>;
  onChange(listener: (uid: string | undefined) => void): () => void;
}

export interface UserRepository {
  get(uid: string): Promise<User | null>;
  create(user: User): Promise<void>;
  update(uid: string, changes: Partial<User>): Promise<void>;
}

export interface OrderRepository {
  list(email: string): Promise<Order[]>;
  add(email: string, order: Order): Promise<void>;
}

export interface ImageStorage {
  upload(file: File): Promise<string>;
}

export interface CheckoutGateway {
  start(items: CartItem[], email: string): Promise<void>;
}
