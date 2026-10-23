import { useEffect } from "react";
import Loading from "../components/Utils/Loading";
import Registration from "../components/Auth/Registration";
import UserInfo from "../components/Auth/UserInfo";
import { useAppStore, useUseCases } from "../AppContext";

const UserScreen = () => {
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
