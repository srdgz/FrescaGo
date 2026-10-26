import Button from "../components/Utils/Button";
import toast from "react-hot-toast";
import Loading from "../components/Utils/Loading";
import AvatarUploader from "../components/Utils/AvatarUploader";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";
import { SHIPPING_COUNTRIES, countryName } from "../../domain/countries";
import { profileFormOf } from "../../domain/user";
import type { ProfileForm } from "../../domain/user";
import { useUseCases } from "../AppContext";
import { useAuthSession } from "../hooks/useAuthSession";
import { useLocale, useLocalePath } from "../LocaleContext";

const EditProfileScreen = () => {
  const { t } = useTranslation();
  usePageTitle(t("pageTitle.editProfile"));
  const path = useLocalePath();
  const locale = useLocale();
  const { currentUser, isLoading } = useAuthSession();
  const { updateProfile } = useUseCases();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const [formData, setFormData] = useState<ProfileForm>(
    profileFormOf(currentUser)
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      setSaving(true);
      await updateProfile(currentUser, formData, avatarFile);
      toast.success(t("toast.profileUpdated"));
      navigate(returnTo === "shop" ? path("shop") : path("user"));
    } catch (error) {
      console.error(error);
      toast.error(t("toast.profileError"));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loading title={t("pageTitle.editProfile")} />;
  if (!currentUser) return <Navigate to={path("user")} replace />;

  const cancelTarget = returnTo === "shop" ? path("shop") : path("user");

  return (
    <div className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <div className="card relative mx-auto max-w-md px-6 py-12 sm:px-12 lg:max-w-3xl">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">
            {t("editProfile.editarPerfil")}
          </h1>
          {returnTo === "shop" && (
            <p
              role="status"
              className="mb-6 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent"
            >
              {t("editProfile.needAddress")}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <AvatarUploader
              onFileChange={handleFileChange}
              currentUrl={formData.avatar}
              imgClassName="w-full h-full"
            />

            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="mb-4 font-display text-xl font-bold">
                {t("editProfile.personalData")}
              </legend>
              <div>
                <label htmlFor="profile-firstName" className="mb-2 block text-sm font-medium">
                  {t("editProfile.nombre")}
                </label>
                <input
                  id="profile-firstName"
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="profile-lastName" className="mb-2 block text-sm font-medium">
                  {t("editProfile.apellidos")}
                </label>
                <input
                  id="profile-lastName"
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="profile-phone" className="mb-2 block text-sm font-medium">
                  {t("editProfile.telefono")}
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  pattern="[0-9+()\s\-]{6,20}"
                  title={t("editProfile.phoneHint")}
                  value={formData.phone}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">
                  {t("editProfile.email")}
                </label>
                <input
                  id="profile-email"
                  type="email"
                  readOnly
                  value={currentUser?.email ?? ""}
                  className="field opacity-70"
                />
              </div>
            </fieldset>

            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="mb-1 font-display text-xl font-bold">
                {t("editProfile.shippingTitle")}
              </legend>
              <p className="text-sm text-gray-600 md:col-span-2">
                {t("editProfile.shippingHelp")}
              </p>
              <div className="md:col-span-2">
                <label htmlFor="profile-street" className="mb-2 block text-sm font-medium">
                  {t("editProfile.street")}
                </label>
                <input
                  id="profile-street"
                  type="text"
                  name="street"
                  autoComplete="street-address"
                  required
                  maxLength={200}
                  value={formData.street}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="profile-postalCode" className="mb-2 block text-sm font-medium">
                  {t("editProfile.postalCode")}
                </label>
                <input
                  id="profile-postalCode"
                  type="text"
                  name="postalCode"
                  autoComplete="postal-code"
                  required
                  pattern="[A-Za-z0-9][A-Za-z0-9 \-]{2,9}"
                  title={t("editProfile.postalCodeHint")}
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="profile-city" className="mb-2 block text-sm font-medium">
                  {t("editProfile.city")}
                </label>
                <input
                  id="profile-city"
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                  value={formData.city}
                  onChange={handleChange}
                  className="field"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="profile-country" className="mb-2 block text-sm font-medium">
                  {t("editProfile.country")}
                </label>
                <select
                  id="profile-country"
                  name="country"
                  autoComplete="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="field"
                >
                  {SHIPPING_COUNTRIES.map((code) => (
                    <option key={code} value={code}>
                      {countryName(code, locale)}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center justify-end gap-4">
              <Button
                text={t("editProfile.cancelar")}
                to={cancelTarget}
                variant="outline"
                className="mb-0!"
              />
              <button
                type="submit"
                disabled={saving}
                className="primary-btn disabled:opacity-60"
              >
                {t("editProfile.guardar")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProfileScreen;
