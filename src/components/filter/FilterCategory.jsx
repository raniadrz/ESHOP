import React, { useState } from "react";

const FilterCategory = ({
  onFilterChange,
  categories,
  categories2,
  subcategories,
  maxPrice,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory2, setSelectedCategory2] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(maxPrice);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onFilterChange({
      category: e.target.value,
      category2: selectedCategory2,
      subcategory: selectedSubcategory,
      price: selectedPriceRange,
    });
  };

  const handleCategory2Change = (e) => {
    setSelectedCategory2(e.target.value);
    onFilterChange({
      category: selectedCategory,
      category2: e.target.value,
      subcategory: selectedSubcategory,
      price: selectedPriceRange,
    });
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    onFilterChange({
      category: selectedCategory,
      category2: selectedCategory2,
      subcategory: e.target.value,
      price: selectedPriceRange,
    });
  };

  const handlePriceChange = (e) => {
    setSelectedPriceRange(e.target.value);
    onFilterChange({
      category: selectedCategory,
      category2: selectedCategory2,
      subcategory: selectedSubcategory,
      price: e.target.value,
    });
  };

  return (
    <div className="filters p-4 bg-white rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Filter</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Breed </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Breeds </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Category</label>
        <select
          value={selectedCategory2}
          onChange={handleCategory2Change}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          {categories2.map((category2, index) => (
            <option key={index} value={category2}>
              {category2}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Subcategory</label>
        <select
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Subcategories</option>
          {subcategories.map((subcategory, index) => (
            <option key={index} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Max Price</label>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={selectedPriceRange}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="text-gray-700 text-sm">€{selectedPriceRange}</div>
      </div>
    </div>
  );
};

export default FilterCategory;
