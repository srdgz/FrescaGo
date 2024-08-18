import { useEffect } from "react";
import Loading from "../components/Utils/Loading";
import Registration from "../components/Auth/Registration";
import UserInfo from "../components/Auth/UserInfo";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { store } from "../lib/store";

const UserScreen = () => {
  const { currentUser, getUserInfo, isLoading } = store();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      getUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [getUserInfo]);

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
