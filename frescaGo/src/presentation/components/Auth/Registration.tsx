import { useState } from "react";
import type { FormEvent } from "react";
import Label from "../Utils/Label";
import Login from "./Login";
import AvatarUploader from "../Utils/AvatarUploader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthError } from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { registrationErrorKey } from "../../authMessages";
import { useTranslation } from "react-i18next";

const Registration = () => {
  const { t } = useTranslation();
  const { register } = useUseCases();
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { firstName, lastName, email, password } = Object.fromEntries(
      formData
    ) as Record<string, string>;
    try {
      setLoading(true);
      await register({ firstName, lastName, email, password }, avatarFile);
      setLogin(true);
    } catch (error) {
      console.log("Error", error);
      setErrMsg(
        t(
          registrationErrorKey(
            error instanceof AuthError ? error.code : "unknown"
          )
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!login ? (
        <div className="card max-w-md lg:max-w-3xl mx-auto my-14 p-6 sm:p-10 md:p-14">
          <form onSubmit={handleRegistration} className="text-secondary">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-lg font-bold uppercase leading-7 text-secondary">
                {t("registration.crearUnaCuenta")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t("registration.proporcioneLaInformacionRequerida")}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-6">
              <div>
                <Label title={t("registration.nombre")} htmlFor="firstName" />
                <input
                  type="text"
                  name="firstName"
                  className="field mt-2"
                />
              </div>
              <div>
                <Label title={t("registration.apellido")} htmlFor="lastName" />
                <input
                  type="text"
                  name="lastName"
                  className="field mt-2"
                />
              </div>
              <div className="col-span-full lg:col-span-2">
                <Label title={t("registration.email")} htmlFor="email" />
                <input
                  type="email"
                  name="email"
                  className="field mt-2"
                />
              </div>
              <div className="relative col-span-full lg:col-span-2">
                <Label title={t("registration.contrasena")} htmlFor="password" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="field mt-2"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer mt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-gray-500 text-2xl hover:text-secondary" />
                  ) : (
                    <AiOutlineEye className="text-gray-500 text-2xl hover:text-secondary" />
                  )}
                </div>
              </div>
              <div className="col-span-full lg:col-span-2">
                <div className="mt-2 flex items-center gap-x-3">
                  <div className="flex-1">
                    <Label title={t("registration.fotoDePerfil")} />
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-4">
                      <AvatarUploader
                        onFileChange={handleFileChange}
                        currentUrl={""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errMsg && (
              <p className="bg-danger-soft text-danger text-center py-2 rounded-md tracking-wide font-semibold mt-4">
                {errMsg}
              </p>
            )}
            <button
              disabled={loading}
              type="submit"
              className="primary-btn mt-5 w-full uppercase tracking-wide disabled:opacity-60"
            >
              {loading ? t("common.loading") : t("common.register")}
            </button>
          </form>
          <p className="text-sm leading-6 text-gray-600 text-center mt-4">
            {t("registration.yaTienesUnaCuenta")}{" "}
            <button
              onClick={() => setLogin(true)}
              className="text-brand font-semibold underline underline-offset-2 decoration-[1px] hover:text-brand duration-200"
            >
              {t("registration.iniciarSesion")}
            </button>
          </p>
        </div>
      ) : (
        <Login setLogin={setLogin} />
      )}
    </div>
  );
};

export default Registration;
