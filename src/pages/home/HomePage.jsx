import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Correct import
import Layout from "../../components/layout/Layout";
import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import SearchByTitle from "../../components/searchBar/SearchBar";
import Testimonial from "../../components/testimonial/Testimonial";
import myContext from "../../context/myContext";
import Filters from "../../components/filter/FilterCategory";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";
import { Dialog, IconButton } from "@mui/material"; // Import Dialog for modal
import FilterListIcon from '@mui/icons-material/FilterList'; // Icon for filter button

const HomePage = () => {
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;
  const [filteredProducts, setFilteredProducts] = useState(getAllProduct);
  const [filterModalOpen, setFilterModalOpen] = useState(false); // State to manage modal visibility

  const categories = [...new Set(getAllProduct.map((product) => product.category))];
  const categories2 = [...new Set(getAllProduct.map((product) => product.category2))];
  const subcategories = [...new Set(getAllProduct.map((product) => product.subcategory))];
  const maxPrice = Math.max(...getAllProduct.map((product) => product.price));

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correct use of the hook

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart");
  };

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Deleted from cart");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleFilterChange = (filters) => {
    const { category, category2, subcategory, price } = filters;
    setFilteredProducts(
      getAllProduct.filter(
        (product) =>
          (category ? product.category === category : true) &&
          (category2 ? product.category2 === category2 : true) &&
          (subcategory ? product.subcategory === subcategory : true) &&
          (price ? product.price <= price : true)
      )
    );
  };

  const toggleFilterModal = () => {
    setFilterModalOpen(!filterModalOpen);
  };

  return (
    <Layout>
      <HeroSection />
      <div className="flex">
        <div className="w-3/4">
          <Category />
          <SearchByTitle />
          <IconButton onClick={toggleFilterModal} className="mb-4" title="Open Filters">
            <FilterListIcon style={{ fontSize: 30 }} />
          </IconButton>
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => {
                  const { id, title, price, productImageUrl } = item;
                  return (
                    <div key={index} className="p-4 w-full md:w-1/4">
                      <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                        <img
                          className="lg:h-80 h-96 w-full"
                          src={productImageUrl}
                          alt="product"
                          onClick={() => navigate(`/productinfo/${id}`)}
                        />
                        <div className="p-6">
                          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                            E-ctb
                          </h2>
                          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                            {title.substring(0, 25)}
                          </h1>
                          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                            {price}€
                          </h1>
                          <div className="flex justify-center">
                            {cartItems.some((p) => p.id === item.id) ? (
                              <button
                                onClick={() => deleteCart(item)}
                                className="bg-blue-700 hover:bg-blue-600 w-full text-white py-[4px] rounded-lg font-bold"
                              >
                                Remove from Cart
                              </button>
                            ) : (
                              <button
                                onClick={() => addCart(item)}
                                className="bg-blue-500 hover:bg-blue-600 w-full text-white py-[4px] rounded-lg font-bold"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center">
                  <p className="text-xl text-gray-500">No products found.</p>
                </div>
              )}
            </div>
          )}
          <Testimonial />
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={filterModalOpen} onClose={toggleFilterModal} maxWidth="md" fullWidth>
        <div className="p-4">
          <Filters
            onFilterChange={handleFilterChange}
            categories={categories}
            categories2={categories2}
            subcategories={subcategories}
            maxPrice={maxPrice}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={toggleFilterModal}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};

export default HomePage;
