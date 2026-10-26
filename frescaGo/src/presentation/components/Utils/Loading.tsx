import { useTranslation } from "react-i18next";

interface LoadingProps {
  title?: string;
}

const Loading = ({ title }: LoadingProps) => {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      className="flex min-h-[50vh] items-center justify-center space-x-2"
    >
      {title && <h1 className="sr-only">{title}</h1>}
      <span className="sr-only">{t("common.loading")}</span>
      <div className="h-3 w-3 animate-pulse rounded-full bg-primary"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-accent [animation-delay:150ms]"></div>
      <div className="h-3 w-3 animate-pulse rounded-full bg-brand [animation-delay:300ms]"></div>
    </div>
  );
};

export default Loading;
