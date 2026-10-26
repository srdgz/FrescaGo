import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { pageItems } from "../../../domain/pagination";

interface PaginationProps {
  page: number;
  pageCount: number;
  label?: string;
  onChange: (page: number) => void;
}

const control =
  "flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 transition-colors duration-200 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-400 disabled:hover:text-inherit";

const Pagination = ({ page, pageCount, label, onChange }: PaginationProps) => {
  const { t } = useTranslation();

  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label={
        label ? `${t("pagination.label")}: ${label}` : t("pagination.label")
      }
      className="flex justify-center py-8 md:justify-end"
    >
      <ul className="flex flex-wrap items-center gap-2 text-base font-semibold">
        <li>
          <button
            type="button"
            className={control}
            disabled={page === 0}
            aria-label={t("pagination.previous")}
            onClick={() => onChange(page - 1)}
          >
            <IoChevronBack className="text-xl" aria-hidden="true" />
          </button>
        </li>
        {pageItems(page, pageCount).map((item) =>
          item.type === "gap" ? (
            <li
              key={item.key}
              aria-hidden="true"
              className="flex h-10 w-6 items-center justify-center text-gray-600"
            >
              …
            </li>
          ) : (
            <li key={item.page}>
              <button
                type="button"
                aria-label={t("pagination.page", { page: item.page + 1 })}
                aria-current={item.page === page ? "page" : undefined}
                className={
                  item.page === page
                    ? "flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-white"
                    : control
                }
                onClick={() => onChange(item.page)}
              >
                {item.page + 1}
              </button>
            </li>
          )
        )}
        <li>
          <button
            type="button"
            className={control}
            disabled={page === pageCount - 1}
            aria-label={t("pagination.next")}
            onClick={() => onChange(page + 1)}
          >
            <IoChevronForward className="text-xl" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
