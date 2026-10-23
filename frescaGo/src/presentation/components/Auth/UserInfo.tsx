import Button from "../Utils/Button";
import type { User } from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { useTranslation } from "react-i18next";
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
        <div className="relative isolate overflow-hidden bg-secondary/10 px-6 py-24 shadow-2xl rounded-3xl sm:px-16">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
            <img
              src={
                currentUser?.avatar
                  ? currentUser?.avatar
                  : "https://i.ibb.co/qMpPq5Z/user.png"
              }
              alt="userImage"
              className="w-40 h-40 rounded-full border border-gray-300 object-cover p-1"
            />
            <div className="text-start flex-1">
              <h2 className="text-xl font-bold tracking-tight sm:text-4xl text-secondary">
                {t("userInfo.bienvenid")}{" "}
                <span className="underline underline-offset-2 decoration-[1px] font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </h2>
              <p className="text-start mt-3 max-w-3xl text-base leading-6 text-gray-700">
                {t("userInfo.nosAlegraVerteEn")}{" "}
                <span className="text-primary font-bold">Fresca</span>
                <span className="text-secondary font-bold">Go</span>{t("userInfo.aquiPodrasGestionarTu")}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 px-4">
            <Button text={t("userInfo.editarPerfil")} to={path("editProfile")} />
            <Button text={t("userInfo.misPedidos")} to={path("orders")} />
            <button
              onClick={() => signOut()}
              className="primary-btn flex items-center gap-2 mb-6"
            >
              {t("userInfo.cerrarSesion")}
            </button>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#1D4ED8" />
                <stop offset={1} stopColor="#9333EA" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
    </main>
  );
};


export default UserInfo;
