import { useEffect, useState } from "react";
import Loading from "../components/Utils/Loading";
import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { store } from "../lib/store";
import { db } from "../lib/firebase";

const SuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, cartProduct, resetCart } = store();
  const [loading, setLoading] = useState(false);
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    } else if (cartProduct.length > 0) {
      const saveOrder = async () => {
        try {
          setLoading(true);
          const orderRef = doc(db, "orders", currentUser?.email || "");
          const docSnap = await getDoc(orderRef);
          if (docSnap.exists()) {
            await updateDoc(orderRef, {
              orders: arrayUnion({
                userEmail: currentUser?.email,
                paymentId: sessionId,
                orderItems: cartProduct,
                paymentMethod: "stripe",
                userId: currentUser?.id,
              }),
            });
          } else {
            await setDoc(orderRef, {
              orders: [
                {
                  userEmail: currentUser?.email,
                  paymentId: sessionId,
                  orderItems: cartProduct,
                  paymentMethod: "stripe",
                },
              ],
            });
          }
          toast.success("Pago realizado correctamente");
          resetCart();
        } catch (error) {
          console.error(error);
          toast.error("Error al guardar el pedido");
        } finally {
          setLoading(false);
        }
      };
      saveOrder();
    }
  }, [sessionId, navigate, currentUser, cartProduct, resetCart]);

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
