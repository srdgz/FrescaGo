import Button from "../Utils/Button";
import UserAvatar from "../Utils/UserAvatar";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { isShippingAddressComplete } from "../../../domain/user";
import type { User } from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { useLocalePath } from "../../LocaleContext";

interface UserInfoProps {
  currentUser: User | null;
}

const UserInfo = ({ currentUser }: UserInfoProps) => {
  const { t } = useTranslation();
  const path = useLocalePath();
  const { signOut } = useUseCases();
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="card mx-auto max-w-3xl border-gray-300 p-6 shadow-lg sm:p-10">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 sm:text-start">
            <UserAvatar
              user={currentUser}
              className="h-32 w-32 flex-none text-4xl"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                {t("userInfo.bienvenid")}{" "}
                <span className="break-words text-brand">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </h1>
              <p className="mt-3 max-w-prose text-base leading-7 text-gray-700">
                {t("userInfo.nosAlegraVerteEn")}{" "}
                <span className="font-bold text-brand">Fresca</span>
                <span className="font-bold text-accent">Go</span>
                {t("userInfo.aquiPodrasGestionarTu")}
              </p>
            </div>
          </div>
          {!isShippingAddressComplete(currentUser?.shippingAddress) && (
            <p className="mt-8 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
              {t("userInfo.addressNotice")}{" "}
              <Link
                to={path("editProfile")}
                className="font-bold underline underline-offset-4"
              >
                {t("userInfo.addAddress")}
              </Link>
            </p>
          )}
          <hr className="my-8 border-gray-300" />
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              text={t("userInfo.editarPerfil")}
              to={path("editProfile")}
              className="mb-0!"
            />
            <Button
              text={t("userInfo.misPedidos")}
              to={path("orders")}
              variant="outline"
              className="mb-0!"
            />
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full px-6 py-3 font-semibold text-gray-700 underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              {t("userInfo.cerrarSesion")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserInfo;
