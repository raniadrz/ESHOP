import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";

const categoryList = [
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Little Pet' },
    { name: 'Bird' },
    { name: 'Fish' },
    { name: 'Reptile' },
];

const SubCategoryList = [
    { name: 'Τροφές' },
    { name: 'Κλινικές Τροφές' },
    { name: 'Μεταφορά-Διαμονή' },
    { name: 'Αξεσουάρ' },
    { name: 'Υγιεινή' },
    { name: 'Περιποίηση' },
    { name: 'Υγεία' }
];

const UpdateProductPage = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProductFunction } = context;

    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        title: "",
        code: "",
        price: "",
        productImageUrl: "",
        category: "",
        category2: "",
        subcategory: "",
        description: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        productType: "New Product", // Add productType state
    });

    const getSingleProductFunction = async () => {
        setLoading(true);
        try {
            const productDoc = await getDoc(doc(fireDB, "products", id));
            if (productDoc.exists()) {
                const productData = productDoc.data();
                setProduct({
                    ...product,
                    title: productData.title || "",
                    code: productData.code || "",
                    price: productData.price || "",
                    productImageUrl: productData.productImageUrl || "",
                    category: productData.category || "",
                    category2: productData.category2 || "",
                    subcategory: productData.subcategory || "",
                    description: productData.description || "",
                    time: productData.time || Timestamp.now(),
                    date: productData.date || new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    }),
                    productType: productData.productType || "New Product", // Set productType from fetched data
                });
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product data.");
            setLoading(false);
        }
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, 'products', id), product);
            toast.success("Product updated successfully");
            getAllProductFunction();
            navigate('/admin-dashboard');
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product.");
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProductFunction();
    }, [id]);

    const backgroundImageUrl = 'https://t3.ftcdn.net/jpg/04/81/85/46/360_F_481854656_gHGTnBscKXpFEgVTwAT4DL4NXXNhDKU9.jpg'; //Background image URL

    return (
        <div style={{ 
            backgroundImage: `url(${backgroundImageUrl})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            {loading && <Loader />}
            {!loading && (
                <div className="login_Form px-8 py-6 border border-pink-100 rounded-xl shadow-md" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    backdropFilter: 'blur(10px)', 
                    WebkitBackdropFilter: 'blur(10px)', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' 
                }}>
                    <div className="mb-5">
                        <h2 className='text-center text-2xl font-bold text-pink-500 '>
                            Update Product
                        </h2>
                    </div>

                    {/* Radio Group for Product Type */}
                    <div className="mb-3">
                        <label className="text-pink-300 font-bold">Product Type:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="New Product"
                                    checked={product.productType === "New Product"}
                                    onChange={(e) =>
                                        setProduct({ ...product, productType: e.target.value })
                                    }
                                    className="mr-2"
                                />
                                New Product
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="Sales"
                                    checked={product.productType === "Sales"}
                                    onChange={(e) =>
                                        setProduct({ ...product, productType: e.target.value })
                                    }
                                    className="mr-2"
                                />
                                Sales
                            </label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            placeholder='Product Title'
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="code"
                            value={product.code}
                            onChange={(e) => setProduct({ ...product, code: e.target.value })}
                            placeholder='Product Code'
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            placeholder='Product Price'
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            value={product.category}
                            onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none  ">
                            <option disabled>Select Product Category</option>
                            {categoryList.map((value, index) => (
                                <option key={index} value={value.name}>{value.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select
                            value={product.category2}
                            onChange={(e) => setProduct({ ...product, category2: e.target.value })}
                            className="w-full px-1 py-2 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none  ">
                            <option disabled>Select Product Sub Category</option>
                            {SubCategoryList.map((value, index) => (
                                <option key={index} value={value.name}>{value.name}</option>
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
                            className='bg-pink-50 border text-pink-300 border-pink-200 px-2 py-2 w-96 rounded-md outline-none placeholder-pink-300'
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            name="description"
                            placeholder="Product Description"
                            rows="5"
                            className="w-full px-2 py-1 text-pink-300 bg-pink-50 border border-pink-200 rounded-md outline-none placeholder-pink-300"
                        />
                    </div>
                    <div className="mb-3">
                        <button
                            onClick={updateProduct}
                            type='button'
                            className='bg-pink-500 hover:bg-pink-600 w-full text-white text-center py-2 font-bold rounded-md'
                        >
                            Update Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateProductPage;
