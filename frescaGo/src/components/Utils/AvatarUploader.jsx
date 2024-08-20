import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdPhotoLibrary } from "react-icons/md";

const AvatarUploader = ({ onFileChange, currentUrl, imgClassName }) => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: currentUrl || "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      if (onFileChange) {
        onFileChange(e.target.files[0]);
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
            alt="Avatar"
            className={`w-40 h-40 rounded-full border border-gray-300 object-cover mb-4 ${imgClassName}`}
          />
        ) : (
          <MdPhotoLibrary className="mx-auto h-full w-full text-gray-400 p-1" />
        )}
      </div>
      <div className="mt-4 flex items-center mb-1 text-sm leading-6 text-gray-600">
        <label htmlFor="file-upload">
          <span className="relative cursor-pointer rounded-md px-2 py-1 bg-secondary text-white hover:bg-primary-dark">
            Subir archivo
          </span>
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            className="sr-only"
            onChange={handleAvatar}
          />
        </label>
        <p className="pl-1">o arrastra y suelta aquí</p>
      </div>
      <p className="text-xs leading-5 text-gray-500">
        PNG, JPG, GIF hasta 10MB
      </p>
    </div>
  );
};

AvatarUploader.propTypes = {
  onFileChange: PropTypes.func,
  currentUrl: PropTypes.string,
  imgClassName: PropTypes.string,
};

export default AvatarUploader;
