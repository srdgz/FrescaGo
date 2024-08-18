import { useState } from "react";
import PropTypes from "prop-types";
import Label from "../Utils/Label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = ({ setLogin }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const { email, password } = Object.fromEntries(formData);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No hay ningún usuario registrado con este email";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/invalid-email":
          errorMessage = "Por favor, introduce un email válido";
          break;
        case "auth/invalid-credential":
          errorMessage = "El email o la contraseña no coinciden";
          break;
        default:
          errorMessage = "Algo no ha funcionado. Por favor, inténtalo de nuevo";
      }
      console.log("Error", error);
      setErrMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/10 rounded-lg max-w-md lg:max-w-lg mx-auto my-14 p-6 sm:p-10 md:p-14 min-h-[400px] flex flex-col justify-between">
      <form onSubmit={handleLogin} className="text-secondary">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-lg font-bold uppercase leading-7 text-secondary">
            Iniciar Sesión
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Proporcione su correo electrónico y contraseña para acceder a su
            cuenta.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-y-5">
          <div>
            <Label title="Email" htmlFor="email" />
            <input
              type="email"
              name="email"
              className="block w-full rounded-md border-0 bg-white py-1.5 px-4 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-secondary sm:text-sm sm:leading-6 mt-2"
            />
          </div>
          <div className="relative">
            <Label title="Contraseña" htmlFor="password" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="block w-full rounded-md border-0 bg-white py-1.5 px-4 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-secondary sm:text-sm sm:leading-6 mt-2"
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
          <p className="bg-red-100 text-red-600 text-center py-2 rounded-md tracking-wide font-semibold mt-4">
            {errMsg}
          </p>
        )}
        <button
          disabled={loading}
          type="submit"
          className={`mt-5 w-full py-3 uppercase text-base font-bold tracking-wide text-white rounded-md ${
            loading
              ? "bg-primary/10"
              : "bg-primary hover:bg-primary-dark duration-200"
          }`}
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="text-sm leading-6 text-gray-600 text-center mt-4">
        ¿No tienes una cuenta?{" "}
        <button
          onClick={() => setLogin(false)}
          className="text-primary font-semibold underline underline-offset-2 decoration-[1px] hover:text-primary-dark duration-200"
        >
          Registrarse
        </button>
      </p>
    </div>
  );
};

Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
};

export default Login;
