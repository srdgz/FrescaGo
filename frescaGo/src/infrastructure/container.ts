import { makeUseCases } from "../application/useCases";
import { apiBaseUrl, stripePublishableKey } from "./env";
import { createFirebaseAuthService } from "./firebase/FirebaseAuthService";
import { createFirebaseImageStorage } from "./firebase/FirebaseImageStorage";
import { createFirestoreOrderRepository } from "./firebase/FirestoreOrderRepository";
import { createFirestoreUserRepository } from "./firebase/FirestoreUserRepository";
import { createHttpCatalogGateway } from "./http/HttpCatalogGateway";
import { createStripeCheckoutGateway } from "./http/StripeCheckoutGateway";

export const createUseCases = () =>
  makeUseCases({
    catalog: createHttpCatalogGateway(apiBaseUrl),
    auth: createFirebaseAuthService(),
    users: createFirestoreUserRepository(),
    orders: createFirestoreOrderRepository(),
    images: createFirebaseImageStorage(),
    checkout: createStripeCheckoutGateway(apiBaseUrl, stripePublishableKey),
  });
