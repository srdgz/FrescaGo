import { useState } from "react";
import type { FormEvent } from "react";
import Label from "../Utils/Label";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthError } from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { loginErrorKey } from "../../authMessages";
import { useTranslation } from "react-i18next";

interface LoginProps {
  setLogin: (login: boolean) => void;
}

const Login = ({ setLogin }: LoginProps) => {
  const { t } = useTranslation();
  const { signIn } = useUseCases();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const { email, password } = Object.fromEntries(formData) as Record<
        string,
        string
      >;
      await signIn(email, password);
    } catch (error) {
      console.log("Error", error);
      setErrMsg(
        t(loginErrorKey(error instanceof AuthError ? error.code : "unknown"))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md lg:max-w-lg mx-auto my-14 p-6 sm:p-10 md:p-14 min-h-[400px] flex flex-col justify-between">
      <form onSubmit={handleLogin} className="text-secondary">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-lg font-bold uppercase leading-7 text-secondary">
            {t("login.iniciarSesion")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {t("login.proporcioneSuCorreoElectronico")}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-y-5">
          <div>
            <Label title={t("login.email")} htmlFor="email" />
            <input
              type="email"
              name="email"
              className="field mt-2"
            />
          </div>
          <div className="relative">
            <Label title={t("login.contrasena")} htmlFor="password" />
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
          {t("login.iniciarSesion")}
        </button>
      </form>
      <p className="text-sm leading-6 text-gray-600 text-center mt-4">
        {t("login.noTienesUnaCuenta")}{" "}
        <button
          onClick={() => setLogin(false)}
          className="text-brand font-semibold underline underline-offset-2 decoration-[1px] hover:text-brand duration-200"
        >
          {t("login.registrarse")}
        </button>
      </p>
    </div>
  );
};


export default Login;
