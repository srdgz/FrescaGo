import { makeUseCases } from "../application/useCases";
import { apiBaseUrl } from "./env";
import {
  lazyAuthService,
  lazyImageStorage,
  lazyOrderRepository,
  lazyUserRepository,
} from "./lazy";
import {
  createHttpCatalogGateway,
  createHttpRatesGateway,
} from "./http/HttpCatalogGateway";
import { createStripeCheckoutGateway } from "./http/StripeCheckoutGateway";

export const createUseCases = () =>
  makeUseCases({
    catalog: createHttpCatalogGateway(apiBaseUrl),
    rates: createHttpRatesGateway(apiBaseUrl),
    auth: lazyAuthService(async () =>
      (await import("./firebase/FirebaseAuthService")).createFirebaseAuthService()
    ),
    users: lazyUserRepository(async () =>
      (
        await import("./firebase/FirestoreUserRepository")
      ).createFirestoreUserRepository()
    ),
    orders: lazyOrderRepository(async () =>
      (
        await import("./firebase/FirestoreOrderRepository")
      ).createFirestoreOrderRepository()
    ),
    images: lazyImageStorage(async () =>
      (
        await import("./firebase/FirebaseImageStorage")
      ).createFirebaseImageStorage()
    ),
    checkout: createStripeCheckoutGateway(apiBaseUrl),
  });
