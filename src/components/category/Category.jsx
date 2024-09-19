import { useNavigate } from "react-router";
import './Category.css'; // Import the CSS file

// category
const category = [
    {
        image: 'https://assets-global.website-files.com/5d6322f018659f07ac06321a/6243a901867f82acb906b5a9_party-pom.jpg',
        name: 'Dog'
    },
    {
        image: 'https://img.goodfon.com/wallpaper/big/9/a7/koshka-kot-temnyi-ochki-rubashka-zheltyi-fon.webp',
        name: 'Cat'
    },
    {
        image: 'https://www.shutterstock.com/image-photo/blue-bird-ultramarine-flycatcher-superciliaris-600nw-508244377.jpg',
        name: 'Bird'
    },
    {
        image: 'https://w0.peakpx.com/wallpaper/2/622/HD-wallpaper-blue-discus-fish-fish-animals.jpg',
        name: 'Fish'
    },
    {
        image: 'https://st.depositphotos.com/2364469/58366/i/450/depositphotos_583664168-stock-photo-cute-little-rabbit-green-grass.jpg',
        name: 'Little Pet'
    },
    {
        image: 'https://www.thoughtco.com/thmb/KTKF0mDSAXCdLJQcAJq7QLSwBFw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-622013488-55a1fad50d93429fb927087e1f18cff8.jpg',
        name: 'Reptile'
    },
];

const Category = () => {
    // navigate
    const navigate = useNavigate();
    return (
        <div className="category-container">
            <div className="flex overflow-x-scroll lg:justify-center hide-scroll-bar">
                <div className="flex">
                    {/* category */}
                    {category.map((item, index) => {
                        return (
                            <div key={index} className="category-item px-1 lg:px-11">
                                {/* Image */}
                                <div
                                    onClick={() => navigate(`/category/${item.name}`)}
                                    className="category-circle w-16 h-16 lg:w-24 lg:h-24 max-w-xs transition-all cursor-pointer mb-1"
                                >
                                    <div className="flex justify-center items-center h-full">
                                        <img src={item.image} alt={item.name} className="oval-image" />
                                    </div>
                                </div>
                                {/* Name Text */}
                                <h1 className='category-text text-sm lg:text-lg text-center font-medium title-font first-letter:uppercase'>{item.name}</h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Category;
