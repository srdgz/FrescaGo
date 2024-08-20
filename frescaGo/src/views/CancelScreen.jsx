import Button from "../components/Utils/Button";

const CancelScreen = () => {
  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-8 my-12">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-primary">
            Tu pago ha sido cancelado
          </h2>
          <p className="text-gray-600">
            Lamentablemente, tu pago no se completó. Si necesitas ayuda, por
            favor, contacta con nosotros.
          </p>
          <div className="flex items-center gap-x-8">
            <Button text="Volver al inicio" to="/" />
            <Button text="Volver a comprar" to="/productos" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CancelScreen;
