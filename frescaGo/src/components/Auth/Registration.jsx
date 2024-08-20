import { useState } from "react";
import Label from "../Utils/Label";
import Login from "./Login";
import upload from "../../lib/upload";
import AvatarUploader from "../Utils/AvatarUploader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const Registration = () => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (file) => {
    setAvatarFile(file);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { firstName, lastName, email, password } =
      Object.fromEntries(formData);
    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      let imageUrl = null;
      if (avatarFile) {
        imageUrl = await upload(avatarFile);
      }
      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        email,
        avatar: imageUrl,
        id: res.user.uid,
      });
      setLogin(true);
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Por favor, introduce un email válido";
          break;
        case "auth/missing-password":
          errorMessage = "Por favor, introduce una contraseña";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña debe tener al menos 6 caracteres";
          break;
        case "auth/email-already-in-use":
          errorMessage =
            "Este email ya está registrado. Por favor, prueba con otro";
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
    <div>
      {!login ? (
        <div className="bg-secondary/10 rounded-lg max-w-md lg:max-w-3xl mx-auto my-14 p-6 sm:p-10 md:p-14">
          <form onSubmit={handleRegistration} className="text-secondary">
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-lg font-bold uppercase leading-7 text-secondary">
                Crear una cuenta
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Proporcione la información requerida para registrarse.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-y-5 lg:grid-cols-2 lg:gap-x-6">
              <div>
                <Label title="Nombre" htmlFor="firstName" />
                <input
                  type="text"
                  name="firstName"
                  className="block w-full rounded-md border-0 bg-white py-1.5 px-4 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-secondary sm:text-sm sm:leading-6 mt-2"
                />
              </div>
              <div>
                <Label title="Apellido" htmlFor="lastName" />
                <input
                  type="text"
                  name="lastName"
                  className="block w-full rounded-md border-0 bg-white py-1.5 px-4 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-secondary sm:text-sm sm:leading-6 mt-2"
                />
              </div>
              <div className="col-span-full lg:col-span-2">
                <Label title="Email" htmlFor="email" />
                <input
                  type="email"
                  name="email"
                  className="block w-full rounded-md border-0 bg-white py-1.5 px-4 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-secondary sm:text-sm sm:leading-6 mt-2"
                />
              </div>
              <div className="relative col-span-full lg:col-span-2">
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
              <div className="col-span-full lg:col-span-2">
                <div className="mt-2 flex items-center gap-x-3">
                  <div className="flex-1">
                    <Label title="Foto de perfil" />
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
              {loading ? "Cargando..." : "Registrar"}
            </button>
          </form>
          <p className="text-sm leading-6 text-gray-600 text-center mt-4">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={() => setLogin(true)}
              className="text-primary font-semibold underline underline-offset-2 decoration-[1px] hover:text-primary-dark duration-200"
            >
              Iniciar sesión
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
