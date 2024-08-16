import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { FaFilter, FaTimes } from "react-icons/fa"; // Import filter and close icons
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const CategoryPage = () => {
  const { categoryname } = useParams();
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;

  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory2, setSelectedCategory2] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [availableCategory2, setAvailableCategory2] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // State for showing/hiding filters

  useEffect(() => {
    // Extract available Category2 and SubCategory from the product list for the selected category
    const category2Set = new Set();
    const subCategorySet = new Set();

    getAllProduct.forEach((product) => {
      if (product.category.includes(categoryname)) {
        category2Set.add(product.category2);
        subCategorySet.add(product.subcategory);
      }
    });

    setAvailableCategory2(Array.from(category2Set));
    setAvailableSubCategories(Array.from(subCategorySet));
  }, [getAllProduct, categoryname]);

  useEffect(() => {
    const filtered = getAllProduct.filter((product) => {
      return (
        product.category.includes(categoryname) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (selectedCategory2.length === 0 ||
          selectedCategory2.includes(product.category2)) &&
        (selectedSubCategory.length === 0 ||
          selectedSubCategory.includes(product.subcategory))
      );
    });
    setFilteredProducts(filtered);
  }, [
    getAllProduct,
    categoryname,
    priceRange,
    selectedCategory2,
    selectedSubCategory,
  ]);

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

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

  const handleCategory2Selection = (category) => {
    setSelectedCategory2((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubCategorySelection = (subCategory) => {
    setSelectedSubCategory((prev) =>
      prev.includes(subCategory)
        ? prev.filter((s) => s !== subCategory)
        : [...prev, subCategory]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevRange) =>
      name === "min"
        ? [Number(value), prevRange[1]]
        : [prevRange[0], Number(value)]
    );
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row mt-10">
        {/* Button to toggle filter visibility */}
        <button
          onClick={toggleFilters}
          className="flex items-center justify-center px-4 py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md md:hidden"
        >
          {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
          {showFilters ? "Close Filters" : "Open Filters"}
        </button>

        {/* Filter Sidebar */}
        <aside
          className={`w-full md:w-1/4 p-4 bg-gray-100 ${
            showFilters ? "block" : "hidden"
          } md:block`}
        >
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          {/* Price Range Filter */}
          <div className="mb-4">
            <h3 className="font-semibold">Price Range</h3>
            <input
              type="number"
              name="min"
              placeholder="Min"
              className="border p-2 w-full mb-2"
              value={priceRange[0]}
              onChange={handlePriceChange}
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              className="border p-2 w-full"
              value={priceRange[1]}
              onChange={handlePriceChange}
            />
          </div>

          {/* Category2 Filter */}
          <div className="mb-4">
            <h3 className="font-semibold">Category2</h3>
            {availableCategory2.map((category) => (
              <div key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={category}
                  className="mr-2"
                  checked={selectedCategory2.includes(category)}
                  onChange={() => handleCategory2Selection(category)}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>

          {/* SubCategory Filter */}
          <div className="mb-4">
            <h3 className="font-semibold">SubCategory</h3>
            {availableSubCategories.map((subCategory) => (
              <div key={subCategory} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={subCategory}
                  className="mr-2"
                  checked={selectedSubCategory.includes(subCategory)}
                  onChange={() => handleSubCategorySelection(subCategory)}
                />
                <label htmlFor={subCategory}>{subCategory}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 p-4">
          {/* Heading */}
          <div className="">
            <h1 className="text-center mb-5 text-2xl font-semibold first-letter:uppercase">
              {categoryname}
            </h1>
          </div>

          {/* Product Display */}
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <section className="text-gray-600 body-font">
              <div className="container px-5 py-5 mx-auto">
                <div className="flex flex-wrap -m-4 justify-center">
                  {filteredProducts.length > 0 ? (
                    <>
                      {filteredProducts.map((item, index) => {
                        const { id, title, price, productImageUrl, productType } = item;
                        return (
                          <div key={index} className="p-4 w-full md:w-1/4">
                            <div className="relative h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                              
                              {/* Conditionally render product type icons */}
                              {productType === "New Product" && (
                                <div className="absolute top-2 left-2">
                                  <NewReleasesIcon style={{ color: 'green' }} />
                                </div>
                              )}
                              {productType === "Sales" && (
                                <div className="absolute top-2 right-2">
                                  <LocalOfferIcon style={{ color: 'red' }} />
                                </div>
                              )}
                              
                              <img
                                onClick={() => navigate(`/productinfo/${id}`)}
                                className="lg:h-80 h-96 w-full object-cover"
                                src={productImageUrl}
                                alt="product"
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
                                      Delete From Cart
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => addCart(item)}
                                      className="bg-blue-500 hover:bg-blue-600 w-full text-white py-[4px] rounded-lg font-bold"
                                    >
                                      Add To Cart
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div>
                      <div className="flex justify-center">
                        <img
                          className="mb-2"
                          src="https://cdn-icons-png.flaticon.com/256/11234/11234339.png"
                          alt=""
                        />
                      </div>
                      <h1 className="text-black text-xl">
                        No {categoryname} product found
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default CategoryPage;
