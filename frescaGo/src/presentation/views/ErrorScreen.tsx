import { Link } from "react-router-dom";

const ErrorScreen = () => {
  return (
    <main className="overflow-x-hidden min-h-screen flex justify-center items-center">
      <div className="text-center">
        <p className="text-4xl font-semibold text-primary">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          ¡Esta página no existe!
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Parece que no podemos encontrar lo que estás buscando.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/" className="primary-btn flex items-center gap-2 mb-6">
            Volver atrás
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorScreen;
