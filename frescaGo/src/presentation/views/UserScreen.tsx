import Loading from "../components/Utils/Loading";
import Registration from "../components/Auth/Registration";
import UserInfo from "../components/Auth/UserInfo";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuthSession } from "../hooks/useAuthSession";

const UserScreen = () => {
  const { t } = useTranslation();
  usePageTitle(t("pageTitle.user"));
  const { currentUser, isLoading } = useAuthSession();

  if (isLoading) return <Loading title={t("pageTitle.user")} />;

  return (
    <div className="overflow-x-hidden">
      <section className="container py-12 md:py-24">
        {currentUser ? (
          <UserInfo currentUser={currentUser} />
        ) : (
          <>
            <h1 className="sr-only">{t("nav.account")}</h1>
            <Registration />
          </>
        )}
      </section>
    </div>
  );
};

export default UserScreen;
