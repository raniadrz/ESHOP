import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";

const SearchBar = () => {
    const context = useContext(myContext);
    const { getAllProduct } = context;
    
    // State to hold the search term
    const [search, setSearch] = useState("");
    
    // Normalize the search term to lowercase and trim it
    const normalizedSearchTerm = search.trim().toLowerCase();

    // Filter products based on the normalized search term and limit to 8 results
    const filterSearchData = getAllProduct.filter((obj) => 
        obj.title.toLowerCase().includes(normalizedSearchTerm)
    ).slice(0, 8);

    const navigate = useNavigate();

    return (
        <div className="relative flex justify-end mt-5">
            {/* Container for search input and dropdown */}
            <div className="w-96">
                {/* Search input */}
                <div className="input flex justify-end">
                    <input
                        type="text"
                        placeholder="Search here"
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-200 placeholder-gray-400 rounded-lg px-2 py-2 w-full outline-none text-black"
                    />
                </div>

                {/* Search dropdown */}
                <div className="relative flex justify-end">
                    {normalizedSearchTerm && (
                        <div className="absolute top-full mt-1 w-full bg-gray-200 z-50 rounded-lg px-2 py-2">
                            {filterSearchData.length > 0 ? (
                                <>
                                    {filterSearchData.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="py-2 px-2 cursor-pointer hover:bg-gray-300" 
                                            onClick={() => navigate(`/productinfo/${item.id}`)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <img className="w-10" src={item.productImageUrl} alt="" />
                                                {item.title}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <img className="w-20" src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png" alt="No results" />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
