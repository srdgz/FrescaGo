import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import type { ImageStorage } from "../../application/ports";
import { storage } from "./client";

export const createFirebaseImageStorage = (): ImageStorage => ({
  upload(file) {
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        null,
        (error) => reject(new Error(`Upload failed: ${error.code}`)),
        () => {
          getDownloadURL(task.snapshot.ref).then(resolve, reject);
        }
      );
    });
  },
});
