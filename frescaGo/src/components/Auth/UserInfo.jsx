import React from "react";
import toast from "react-hot-toast";
import { auth } from "../../lib/firebase";

const UserInfo = ({ currentUser }) => {
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="relative isolate overflow-hidden bg-secondary/10 px-6 py-24 shadow-2xl rounded-3xl sm:px-16">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
            <img
              src={
                currentUser?.avatar
                  ? currentUser?.avatar
                  : "https://i.ibb.co/mJRkRRV/png-clipart-profile-logo-computer-icons-user-user-blue-heroes-thumbnail.png"
              }
              alt="userImage"
              className="w-40 h-40 rounded-full border border-gray-300 object-cover p-1"
            />
            <div className="text-start flex-1">
              <h2 className="text-xl font-bold tracking-tight sm:text-4xl text-secondary">
                Bienvenid@{" "}
                <span className="underline underline-offset-2 decoration-[1px] font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </h2>
              <p className="text-start mt-3 max-w-3xl text-base leading-6 text-gray-700">
                ¡Nos alegra verte en{" "}
                <span className="text-primary font-bold">Fresca</span>
                <span className="text-secondary font-bold">Go</span>! Aquí
                podrás gestionar tu perfil, actualizar tu información y
                disfrutar de una experiencia de compra rápida y eficiente.
                Nuestro objetivo es hacer que tus compras sean frescas, fáciles
                y sin complicaciones. ¡Gracias por elegirnos!
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5 px-4">
            <button
              onClick={() =>
                toast.error("Esta opción aún no se ha implementado")
              }
              className="rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
            >
              Editar perfil
            </button>
            <button
              onClick={() =>
                toast.error("Esta opción aún no se ha implementado")
              }
              className="rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
            >
              Dirección
            </button>
            <button
              onClick={() => auth.signOut()}
              className="rounded-md bg-primary px-8 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
            >
              Cerrar sesión
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
