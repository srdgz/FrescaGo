import { useState } from "react";
import type { FormEvent } from "react";
import Label from "../Utils/Label";
import PasswordInput from "../Utils/PasswordInput";
import { useTranslation } from "react-i18next";
import { AuthError } from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { loginErrorKey } from "../../authMessages";

interface LoginProps {
  setLogin: (login: boolean) => void;
}

const Login = ({ setLogin }: LoginProps) => {
  const { t } = useTranslation();
  const { signIn } = useUseCases();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrMsg("");
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
    <div className="card mx-auto my-14 flex min-h-[400px] max-w-md flex-col justify-between p-6 sm:p-10 md:p-14 lg:max-w-lg">
      <form onSubmit={handleLogin} aria-labelledby="login-title">
        <div className="border-b border-gray-200 pb-5">
          <h2
            id="login-title"
            className="text-lg font-bold uppercase leading-7"
          >
            {t("login.iniciarSesion")}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {t("login.proporcioneSuCorreoElectronico")}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-y-5">
          <div>
            <Label title={t("login.email")} htmlFor="login-email" />
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field mt-2"
            />
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            label={t("login.contrasena")}
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            visible={showPassword}
            onToggleVisible={() => setShowPassword((value) => !value)}
          />
        </div>
        {errMsg && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-danger-soft py-2 text-center font-semibold tracking-wide text-danger"
          >
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
      <p className="mt-4 text-center text-sm leading-6 text-gray-600">
        {t("login.noTienesUnaCuenta")}{" "}
        <button
          type="button"
          onClick={() => setLogin(false)}
          className="font-semibold text-brand underline underline-offset-2 decoration-[1px] duration-200"
        >
          {t("login.registrarse")}
        </button>
      </p>
    </div>
  );
};

export default Login;
