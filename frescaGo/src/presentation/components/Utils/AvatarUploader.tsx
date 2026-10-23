import { useState } from "react";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { MdPhotoLibrary } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface AvatarUploaderProps {
  onFileChange?: (file: File) => void;
  currentUrl?: string | null;
  imgClassName?: string;
}

const AvatarUploader = ({
  onFileChange,
  currentUrl,
  imgClassName = "",
}: AvatarUploaderProps) => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState({
    file: null as File | null,
    url: currentUrl || "",
  });

  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar({
        file,
        url: URL.createObjectURL(file),
      });
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 border border-gray-300 rounded-full p-1">
        {avatar.url ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            viewport={{ once: true }}
            src={avatar.url}
            alt={t("avatar.avatar")}
            className={`w-40 h-40 rounded-full border border-gray-300 object-cover mb-4 ${imgClassName}`}
          />
        ) : (
          <MdPhotoLibrary className="mx-auto h-full w-full text-gray-400 p-1" />
        )}
      </div>
      <div className="mt-4 flex items-center mb-1 text-sm leading-6 text-gray-600">
        <label htmlFor="file-upload">
          <span className="relative cursor-pointer rounded-md px-2 py-1 bg-secondary text-white hover:bg-primary-dark">
            {t("avatar.subirArchivo")}
          </span>
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            className="sr-only"
            onChange={handleAvatar}
          />
        </label>
        <p className="pl-1">{t("avatar.oArrastraYSuelta")}</p>
      </div>
      <p className="text-xs leading-5 text-gray-500">
        {t("avatar.pngJpgGifHasta")}
      </p>
    </div>
  );
};


export default AvatarUploader;
