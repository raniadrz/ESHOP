import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { categoryImages } from './categoryImages';

const categoryList = [
    { name: 'Breed' },
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Little Pet' },
    { name: 'Bird' },
    { name: 'Fish' },
    { name: 'Reptile' },
    { name: 'Sales' }
];

const SubCategoryList = [
    { name: 'Category' },
    { name: 'Τροφές' },
    { name: 'Κλινικές Τροφές' },
    { name: 'Μεταφορά-Διαμονή' },
    { name: 'Αξεσουάρ' },
    { name: 'Υγιεινή' },
    { name: 'Περιποίηση' },
    { name: 'Υγεία' }
];

const AddProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: "",
        code: "",
        price: "",
        category: "",
        category2: "",
        subcategory: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        ),
        productImageUrl: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (product.category) {
            setProduct((prevProduct) => ({
                ...prevProduct,
                productImageUrl: categoryImages[product.category] || defaultImageUrl,
            }));
        }
    }, [product.category]);

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImageToFirebase = async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, `product-images/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const isValidProduct = (product) => {
        return product.title && product.code && product.price && product.category && product.subcategory && product.description;
    };

    const addProductFunction = async () => {
        if (!isValidProduct(product)) {
            return toast.error("All fields are required");
        }

        setLoading(true);
        try {
            let imageUrl = product.productImageUrl;
            if (imageFile) {
                imageUrl = await uploadImageToFirebase(imageFile);
            }
            const productData = { ...product, productImageUrl: imageUrl };
            const productRef = collection(fireDB, 'products');
            await addDoc(productRef, productData);
            toast.success("Product added successfully");
            navigate('/admin-dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };
    const fetchImageFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], "image.jpg", { type: "image/jpeg" });
    };

    const backgroundImageUrl = 'https://t3.ftcdn.net/jpg/04/81/85/46/360_F_481854656_gHGTnBscKXpFEgVTwAT4DL4NXXNhDKU9.jpg'; // Replace with your background image URL

    return (
        <div style={{ 
            backgroundImage: `url(${backgroundImageUrl})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            {loading && <Loader />}
            {!loading && (
                <div className="login_Form px-10 border border-blue-100 rounded-xl shadow-md" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    backdropFilter: 'blur(10px)', 
                    WebkitBackdropFilter: 'blur(10px)', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
                }}>
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-blue-500 '>
                            Add Product
                        </h2>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            placeholder='Product Title'
                            className='bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="code"
                            value={product.code}
                            onChange={(e) => setProduct({ ...product, code: e.target.value })}
                            placeholder='Product Code'
                            className='bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            placeholder='Product Price'
                            className='bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="file"
                            name="productImageFile"
                            onChange={handleImageFileChange}
                            className='bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300'
                        />
                    </div>
                    {imagePreview && (
                        <div className="mb-3">
                            <img src={imagePreview} alt="Image Preview" className="w-56 h-50 object-cover rounded-md" />
                        </div>
                    )}
                   <div className="mb-3 flex gap-4">
                        <select
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            className="w-1/2 px-1 py-2 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none  ">
                            <option disabled>Select Product Category</option>
                            {categoryList.map((value, index) => (
                                <option className=" first-letter:uppercase" key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>
                        <select
                            value={product.category2}
                            onChange={(e) => setProduct({ ...product, category2: e.target.value })}
                            className="w-1/2 px-1 py-2 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none  ">
                            <option disabled>Select Product Sub Category</option>
                            {SubCategoryList.map((value, index) => (
                                <option className=" first-letter:uppercase" key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="subcategory"
                            value={product.subcategory}
                            onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
                            placeholder='Product Sub Category'
                            className='bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300'
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            name="description"
                            placeholder="Product Description"
                            rows="5"
                            className="w-full px-2 py-1 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none placeholder-blue-300"
                        />
                    </div>
                    <div className="mb-3">
                        <button
                            onClick={addProductFunction}
                            type='button'
                            className='bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddProductPage;
