import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import AddToCartBtn from "../Utils/AddToCartBtn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CategoryPagination = ({ products, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const currentProducts = products.slice(startOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleProduct = (id) => {
    navigate(`/productos/${id}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl px-4 py-4 shadow-[0_0_22px_0_rgba(0,0,0,0.15)] cursor-pointer"
            onClick={() => handleProduct(product.id)}
          >
            <div className="flex flex-row gap-6 justify-evenly">
              <div className="flex justify-center items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-[100px] object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-lg font-semibold text-secondary">
                  {product.price.toFixed(2)}€/Kg
                </p>
                <AddToCartBtn
                  product={product}
                  title="Comprar"
                  className="bg-primary hover:bg-primary text-white h-[40px] w-[120px] flex items-center justify-center text-md rounded-full shadow-lg transition duration-200 mt-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-center md:justify-end items-center py-10">
        <ReactPaginate
          previousLabel={<IoChevronBack className="text-xl" />}
          nextLabel={<IoChevronForward className="text-xl" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          containerClassName="flex text-base font-semibold py-10"
          pageClassName="mr-3"
          pageLinkClassName="w-9 h-9 border border-lightColor rounded-xl hover:border-gray-500 duration-300 flex justify-center items-center"
          activeClassName="bg-primary text-white border border-primary rounded-xl"
          previousClassName="mr-3 flex items-center"
          nextClassName="ml-0 flex items-center"
        />
      </div>
    </div>
  );
};

CategoryPagination.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string,
      title: PropTypes.string,
      price: PropTypes.number,
    })
  ),
  itemsPerPage: PropTypes.number.isRequired,
};

export default CategoryPagination;
