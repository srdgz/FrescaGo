import { useEffect } from "react";
import Loading from "../components/Utils/Loading";
import Registration from "../components/Auth/Registration";
import UserInfo from "../components/Auth/UserInfo";
import { useTranslation } from "react-i18next";
import { useAppStore, useUseCases } from "../AppContext";

const UserScreen = () => {
  const { t } = useTranslation();
  const { currentUser, getUserInfo, isLoading } = useAppStore();
  const { observeAuth } = useUseCases();

  useEffect(() => {
    const unSub = observeAuth((uid) => {
      getUserInfo(uid);
    });
    return () => {
      unSub();
    };
  }, [getUserInfo, observeAuth]);

  if (isLoading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        <h1 className="sr-only">{t("nav.account")}</h1>
        {currentUser ? (
          <UserInfo currentUser={currentUser} />
        ) : (
          <Registration />
        )}
      </section>
    </main>
  );
};

export default UserScreen;
