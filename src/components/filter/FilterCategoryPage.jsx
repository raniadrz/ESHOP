import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";

const FilterCategoryPage = () => {
  const { categoryname } = useParams();
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;

  const navigate = useNavigate();

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  useEffect(() => {
    // Extract available brands from the product list
    const brands = Array.from(new Set(getAllProduct.map((product) => product.brand)));
    setAvailableBrands(brands);
  }, [getAllProduct]);

  const filterProduct = getAllProduct.filter((obj) => {
    return (
      obj.category.includes(categoryname) &&
      obj.price >= priceRange[0] &&
      obj.price <= priceRange[1] &&
      (selectedBrands.length === 0 || selectedBrands.includes(obj.brand))
    );
  });

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

  const handleBrandSelection = (brand) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.includes(brand)
        ? prevBrands.filter((b) => b !== brand)
        : [...prevBrands, brand]
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

  return (
    <Layout>
      <div className="flex mt-10">
        {/* Filter Sidebar */}
        <aside className="w-1/4 p-4 bg-gray-100">
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

          {/* Brand Filter */}
          <div className="mb-4">
            <h3 className="font-semibold">Brand</h3>
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={brand}
                  className="mr-2"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandSelection(brand)}
                />
                <label htmlFor={brand}>{brand}</label>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-4">
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
                  {filterProduct.length > 0 ? (
                    <>
                      {filterProduct.map((item, index) => {
                        const { id, title, price, productImageUrl } = item;
                        return (
                          <div key={index} className="p-4 w-full md:w-1/4">
                            <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                              <img
                                onClick={() => navigate(`/productinfo/${id}`)}
                                className="lg:h-80 h-96 w-full"
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

export default FilterCategoryPage;
