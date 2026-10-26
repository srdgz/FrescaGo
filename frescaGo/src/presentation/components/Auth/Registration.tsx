import { useRef, useState } from "react";
import type { FormEvent } from "react";
import Label from "../Utils/Label";
import Login from "./Login";
import AvatarUploader from "../Utils/AvatarUploader";
import PasswordInput from "../Utils/PasswordInput";
import { useTranslation } from "react-i18next";
import {
  AuthError,
  MIN_PASSWORD_LENGTH,
  checkNewPassword,
} from "../../../domain/user";
import { useUseCases } from "../../AppContext";
import { registrationErrorKey } from "../../authMessages";

const Registration = () => {
  const { t } = useTranslation();
  const { register } = useUseCases();
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const setValue = (name: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const passwordTooShort =
    touched.password && values.password.length < MIN_PASSWORD_LENGTH;
  const confirmMismatch =
    touched.confirmPassword &&
    values.confirmPassword.length > 0 &&
    values.password !== values.confirmPassword;

  const handleFileChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");
    const check = checkNewPassword(values.password, values.confirmPassword);
    if (check !== "ok") {
      setTouched({ password: true, confirmPassword: true });
      (check === "too-short" ? passwordRef : confirmRef).current?.focus();
      return;
    }
    try {
      setLoading(true);
      await register(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        },
        avatarFile
      );
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
        <div className="card mx-auto my-14 max-w-md p-6 sm:p-10 md:p-14 lg:max-w-3xl">
          <form onSubmit={handleRegistration} aria-labelledby="register-title">
            <div className="border-b border-gray-200 pb-5">
              <h2
                id="register-title"
                className="text-lg font-bold uppercase leading-7"
              >
                {t("registration.crearUnaCuenta")}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t("registration.proporcioneLaInformacionRequerida")}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-6">
              <div>
                <Label title={t("registration.nombre")} htmlFor="register-firstName" />
                <input
                  id="register-firstName"
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  value={values.firstName}
                  onChange={(event) => setValue("firstName")(event.target.value)}
                  className="field mt-2"
                />
              </div>
              <div>
                <Label title={t("registration.apellido")} htmlFor="register-lastName" />
                <input
                  id="register-lastName"
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  value={values.lastName}
                  onChange={(event) => setValue("lastName")(event.target.value)}
                  className="field mt-2"
                />
              </div>
              <div className="col-span-full lg:col-span-2">
                <Label title={t("registration.email")} htmlFor="register-email" />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(event) => setValue("email")(event.target.value)}
                  className="field mt-2"
                />
              </div>
              <div>
                <PasswordInput
                  id="register-password"
                  name="password"
                  label={t("registration.contrasena")}
                  value={values.password}
                  onChange={setValue("password")}
                  onBlur={() =>
                    setTouched((current) => ({ ...current, password: true }))
                  }
                  autoComplete="new-password"
                  visible={showPassword}
                  onToggleVisible={() => setShowPassword((value) => !value)}
                  describedBy="register-password-hint"
                  invalid={passwordTooShort}
                  minLength={MIN_PASSWORD_LENGTH}
                  inputRef={passwordRef}
                />
                <p
                  id="register-password-hint"
                  className={`mt-1 text-xs ${passwordTooShort ? "font-semibold text-danger" : "text-gray-600"}`}
                >
                  {t("registration.passwordHint", { min: MIN_PASSWORD_LENGTH })}
                </p>
              </div>
              <div>
                <PasswordInput
                  id="register-confirmPassword"
                  name="confirmPassword"
                  label={t("registration.confirmPassword")}
                  value={values.confirmPassword}
                  onChange={setValue("confirmPassword")}
                  onBlur={() =>
                    setTouched((current) => ({
                      ...current,
                      confirmPassword: true,
                    }))
                  }
                  autoComplete="new-password"
                  visible={showPassword}
                  onToggleVisible={() => setShowPassword((value) => !value)}
                  describedBy="register-confirm-feedback"
                  invalid={confirmMismatch}
                  inputRef={confirmRef}
                />
                <p
                  id="register-confirm-feedback"
                  aria-live="polite"
                  className="mt-1 min-h-4 text-xs font-semibold text-danger"
                >
                  {confirmMismatch ? t("registration.passwordMismatch") : ""}
                </p>
              </div>
              <div className="col-span-full lg:col-span-2">
                <div className="mt-2 flex items-center gap-x-3">
                  <div className="flex-1">
                    <p id="register-avatar-label" className="block text-sm font-medium">
                      {t("registration.fotoDePerfil")}
                    </p>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-400 px-6 py-4">
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
              {loading ? t("common.loading") : t("common.register")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm leading-6 text-gray-600">
            {t("registration.yaTienesUnaCuenta")}{" "}
            <button
              type="button"
              onClick={() => setLogin(true)}
              className="font-semibold text-brand underline underline-offset-2 decoration-[1px] duration-200"
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
