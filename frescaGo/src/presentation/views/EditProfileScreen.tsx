import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import Loading from "../components/Utils/Loading";
import AvatarUploader from "../components/Utils/AvatarUploader";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ProfileForm } from "../../domain/user";
import { useAppStore, useUseCases } from "../AppContext";

const EditProfileScreen = () => {
  const { currentUser, isLoading } = useAppStore();
  const { updateProfile } = useUseCases();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileForm>({
    avatar: currentUser?.avatar || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    address: currentUser?.address || "",
    phone: currentUser?.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (file: File) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await updateProfile(currentUser, formData, avatarFile);
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


export default EditProfileScreen;
