import { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore, useUseCases } from "../AppContext";

const SuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveOrder } = useUseCases();
  const { currentUser, cartProduct, resetCart } = useAppStore();
  const [loading, setLoading] = useState(false);
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else if (currentUser && cartProduct.length > 0) {
      const persistOrder = async () => {
        try {
          setLoading(true);
          await saveOrder(currentUser, sessionId, cartProduct);
          toast.success("Pago realizado correctamente");
          resetCart();
        } catch (error) {
          console.error(error);
          toast.error("Error al guardar el pedido");
        } finally {
          setLoading(false);
        }
      };
      persistOrder();
    }
  }, [sessionId, navigate, currentUser, cartProduct, resetCart, saveOrder]);

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        {loading && <Loading />}
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-y-8 my-12">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-secondary">
            {loading
              ? "Tu pago se está procesando"
              : "Pago aceptado en FrescaGo"}
          </h2>
          <p>
            {loading ? "Una vez completado" : "Ahora"} puedes ver tus pedidos o
            continuar comprando con nosotros.
          </p>
          <div className="flex items-center gap-x-8">
            <Button text="Mis pedidos" to="/pedidos" />
            <Button text="Seguir comprando" to="/productos" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default SuccessScreen;
