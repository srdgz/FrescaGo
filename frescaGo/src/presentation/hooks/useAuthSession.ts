import { useEffect } from "react";
import { useAppStore, useUseCases } from "../AppContext";

export const useAuthSession = () => {
  const { observeAuth } = useUseCases();
  const { getUserInfo, isLoading, currentUser } = useAppStore();

  useEffect(
    () =>
      observeAuth((uid) => {
        getUserInfo(uid);
      }),
    [observeAuth, getUserInfo]
  );

  return { isLoading, currentUser };
};
