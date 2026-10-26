import { Paginate } from "./Paginate";
import AddToCartBtn from "../Utils/AddToCartBtn";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../domain/catalog";
import { useMoney } from "../../hooks/useMoney";
import { useLocalePath } from "../../LocaleContext";

interface CategoryPaginationProps {
  products: Product[];
  itemsPerPage: number;
}

const CategoryPagination = ({
  products,
  itemsPerPage,
}: CategoryPaginationProps) => {
  const { t } = useTranslation();
  const { format } = useMoney();
  const path = useLocalePath();
  const [currentPage, setCurrentPage] = useState(0);

  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentProducts = products.slice(startOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currentProducts.map((product) => (
          <li
            key={product.id}
            className="card flex gap-4 p-4 transition duration-200 hover:shadow-md"
          >
            <Link
              to={path("products", product.id)}
              tabIndex={-1}
              aria-hidden="true"
              className="flex h-28 w-28 flex-none items-center justify-center rounded-2xl bg-photo"
            >
              <img
                src={product.image}
                alt=""
                className="h-20 w-20 object-contain mix-blend-multiply"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <h3 className="font-display text-lg font-bold leading-tight">
                <Link
                  to={path("products", product.id)}
                  className="underline-offset-4 hover:underline"
                >
                  {product.title}
                </Link>
              </h3>
              <p className="font-semibold text-accent">
                {t("common.perKg", { price: format(product.price) })}
              </p>
              <AddToCartBtn
                product={product}
                title={t("pagination.comprar")}
                className="primary-btn px-5! py-2! text-sm"
              />
            </div>
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <nav
          aria-label={t("pagination.label")}
          className="flex flex-col items-center justify-center py-8 md:flex-row md:justify-end"
        >
          <Paginate
            previousLabel={<IoChevronBack className="text-xl" aria-hidden="true" />}
            nextLabel={<IoChevronForward className="text-xl" aria-hidden="true" />}
            previousAriaLabel={t("pagination.previous")}
            nextAriaLabel={t("pagination.next")}
            ariaLabelBuilder={(page) => t("pagination.page", { page })}
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            containerClassName="flex gap-2 text-base font-semibold"
            pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 transition-colors duration-200 hover:border-brand hover:text-brand"
            activeLinkClassName="border-primary! bg-primary text-white! hover:text-white!"
            previousLinkClassName="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 hover:border-brand hover:text-brand"
            nextLinkClassName="flex h-10 w-10 items-center justify-center rounded-full border border-gray-400 hover:border-brand hover:text-brand"
            breakLinkClassName="flex h-10 w-10 items-center justify-center"
          />
        </nav>
      )}
    </div>
  );
};

export default CategoryPagination;
