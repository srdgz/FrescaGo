import PropTypes from "prop-types";
import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import Loading from "../components/Utils/Loading";
import upload from "../lib/upload";
import AvatarUploader from "../components/Utils/AvatarUploader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { store } from "../lib/store";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const EditProfileScreen = () => {
  const { currentUser, isLoading } = store();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: currentUser?.avatar || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    address: currentUser?.address || "",
    phone: currentUser?.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (file) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        avatarUrl = await upload(avatarFile);
      }
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: avatarUrl,
        });
      }
      const userDocRef = doc(db, "users", currentUser.id);
      await updateDoc(userDocRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        phone: formData.phone,
        avatar: avatarUrl,
      });
      toast.success("Perfil actualizado con éxito");
      navigate("/usuario");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="relative max-w-md lg:max-w-3xl mx-auto bg-secondary/10 px-6 py-20 shadow-2xl rounded-3xl sm:px-16">
          <h2 className="text-3xl font-bold text-secondary mb-6">
            Editar Perfil
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarUploader
              onFileChange={handleFileChange}
              currentUrl={formData.avatar}
              imgClassName="w-full h-full"
            />
            <div>
              <label className="block mb-2">Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 rounded w-full max-w-md text-gray-600"
              />
            </div>
            <div>
              <label className="block mb-2">Apellidos</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded w-full max-w-md text-gray-600"
              />
            </div>
            <div>
              <label className="block mb-2">Dirección Completa</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border p-2 rounded w-full max-w-md text-gray-600"
              />
            </div>
            <div>
              <label className="block mb-2">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full max-w-md text-gray-600"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="text"
                readOnly
                value={currentUser?.email}
                className="border p-2 rounded w-full max-w-md cursor-none text-gray-600"
              />
            </div>
            <div>
              <label className="block mb-2">Contraseña</label>
              <input
                type="text"
                readOnly
                value="******"
                className="border p-2 rounded w-full max-w-md cursor-none text-gray-600 mb-12"
              />
            </div>
            <div className="flex justify-end gap-8 items-start">
              <button
                type="submit"
                className="bg-secondary text-white font-semibold py-3 px-6 rounded-xl shadow-[0px_10px_14px_-7px_#fb923c] hover:!scale-110 duration-300"
              >
                Guardar
              </button>
              <Button text="Cancelar" to="/usuario" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

EditProfileScreen.propTypes = {
  currentUser: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

export default EditProfileScreen;
