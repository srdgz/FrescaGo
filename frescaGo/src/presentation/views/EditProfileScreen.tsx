import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import Loading from "../components/Utils/Loading";
import AvatarUploader from "../components/Utils/AvatarUploader";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ProfileForm } from "../../domain/user";
import { useAppStore, useUseCases } from "../AppContext";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../LocaleContext";

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const path = useLocalePath();
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
      toast.success(t("toast.profileUpdated"));
      navigate(path("user"));
    } catch (error) {
      console.error(error);
      toast.error(t("toast.profileError"));
    }
  };

  if (isLoading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="card relative mx-auto max-w-md px-6 py-16 sm:px-16 lg:max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">
            {t("editProfile.editarPerfil")}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AvatarUploader
              onFileChange={handleFileChange}
              currentUrl={formData.avatar}
              imgClassName="w-full h-full"
            />
            <div>
              <label htmlFor="profile-nombre" className="mb-2 block text-sm font-medium">{t("editProfile.nombre")}</label>
              <input id="profile-nombre"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="field max-w-md"
              />
            </div>
            <div>
              <label htmlFor="profile-apellidos" className="mb-2 block text-sm font-medium">{t("editProfile.apellidos")}</label>
              <input id="profile-apellidos"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="field max-w-md"
              />
            </div>
            <div>
              <label htmlFor="profile-direccionCompleta" className="mb-2 block text-sm font-medium">{t("editProfile.direccionCompleta")}</label>
              <input id="profile-direccionCompleta"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="field max-w-md"
              />
            </div>
            <div>
              <label htmlFor="profile-telefono" className="mb-2 block text-sm font-medium">{t("editProfile.telefono")}</label>
              <input id="profile-telefono"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="field max-w-md"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">{t("editProfile.email")}</label>
              <input id="profile-email"
                type="text"
                readOnly
                value={currentUser?.email}
                className="field max-w-md opacity-70"
              />
            </div>
            <div>
              <label htmlFor="profile-contrasena" className="mb-2 block text-sm font-medium">{t("editProfile.contrasena")}</label>
              <input id="profile-contrasena"
                type="text"
                readOnly
                value="******"
                className="field mb-12 max-w-md opacity-70"
              />
            </div>
            <div className="flex justify-end gap-8 items-start">
              <button
                type="submit"
                className="primary-btn"
              >
                {t("editProfile.guardar")}
              </button>
              <Button text={t("editProfile.cancelar")} to={path("user")} />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};


export default EditProfileScreen;
