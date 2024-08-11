import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { categoryImages } from "./categoryImages";

const categoryList = [
  { name: "Dog" },
  { name: "Cat" },
  { name: "Little Pet" },
  { name: "Bird" },
  { name: "Fish" },
  { name: "Reptile" },
];

const category2List = {
  Dog: [
    "Τροφές Σκύλου",
    "Κλινικές Τροφές Σκύλου",
    "Μεταφορά-Διαμονή",
    "Αξεσουάρ",
    "Υγιεινή",
    "Περιποίηση",
  ],
  Cat: [
    "Τροφές Γάτας",
    "Κλινικές Τροφές Γάτας",
    "Μεταφορά-Διαμονή Γάτας",
    "Αξεσουάρ Γάτας",
    "Υγιεινή Γάτας",
    "Περιποίηση Γάτας",
  ],
  "Little Pet": ["Τροφές Little Pet", "Αξεσουάρ Little Pet", "Υγιεινή Little Pet", "Υγεία Little Pet"],
  Bird: ["Τροφές Bird", "Υγεία Bird", "Αξεσουάρ Bird", "Υγιεινή Bird"],
  Fish: ["Τροφές Fish", "Αξεσουάρ Fish", "Φροντίδα-Υγιεινή Fish"],
  Reptile: ["Τροφές Reptile", "Αξεσουάρ Reptile", "Υγιεινή & Υγεία Reptile"],
};

const subcategoryList = {
  "Τροφές Σκύλου": [
    "Ξηρά τροφή",
    "Υγρή Τροφή & Κονσέρβες",
    "Λιχουδιές",
    "Κόκκαλα",
    "Βιταμίνες-Συμπληρώματα διατροφής",
    "Γάλατα-Μπιμπερό",
  ],
  "Κλινικές Τροφές Σκύλου": ["Ξηρά τροφή", "Υγρή Τροφή & Κονσέρβες"],
  "Μεταφορά-Διαμονή": [
    "Κρεβάτια - Μαξιλάρια Σκύλου",
    "Τσάντες μεταφοράς",
    "Κλουβιά μεταφοράς - Ανταλλακτικά",
    "Σπιτάκια-Πόρτες",
    "Crates-Μεταλλικά",
    "Κλουβιά-Πάρκα",
    "Αξεσουάρ αυτοκινήτου",
  ],
  Αξεσουάρ: [
    "Μπολ - Ταΐστρες και Ποτίστρες",
    "Περιλαίμια - Κολάρα Σκύλου και Σαμαράκια Οδηγοί",
    "Παιχνίδια",
    "Ρούχα, Παπούτσια & Αξεσουάρ",
    "Ταυτότητες-Κουδουνάκια",
    "Εκπαίδευση",
    "GPS Trackers",
  ],
  Υγιεινή: [
    "Σακούλες Απορριμμάτων",
    "Πάνες - Σερβιέτες & Βρακάκια",
    "Αντιπαρασιτικά Σκύλου",
    "Κολάρα",
    "Προϊόντα Καθαρισμού Χώρου",
  ],
  Περιποίηση: [
    "Τρίχωμα & Δέρμα",
    "Δόντια & Αναπνοή",
    "Μαντηλάκια",
    "Νύχια & Πατούσες",
    "Αυτιά & Μάτια",
    "Σαμπουάν",
    "Μαλακτικά & Αρώματα",
    "Αnti-Stress",
  ],
  "Τροφές Γάτας": [
    "Ξηρά τροφή",
    "Υγρή Τροφή & Κονσέρβες",
    "Λιχουδιές",
    "Βιταμίνες-Συμπληρώματα διατροφής",
    "Γάλατα-Μπιμπερό",
  ],
  "Κλινικές Τροφές Γάτας": ["Ξηρά τροφή", "Υγρή Τροφή & Κονσέρβες"],
  "Μεταφορά-Διαμονή Γάτας": [
    "Τσάντες μεταφοράς",
    "Κλουβιά μεταφοράς-Ανταλλακτικά",
    "Κρεβάτια για Γάτες",
    "Φωλιές Γάτας",
    "Αξεσουάρ αυτοκινήτου",
    "Πόρτες-Ασφάλεια",
  ],
  "Αξεσουάρ Γάτας": [
    "Μπολ - Ταΐστρες & Ποτίστρες",
    "Περιλαίμια Γάτας - Κολάρα και Σαμαράκια",
    "Παιχνίδια",
    "Ονυχοδρόμια",
    "Εκπαίδευση",
    "Ταυτότητες",
    "Κουδουνάκια",
    "Εποχιακά Είδη",
    "Οδηγοί",
    "GPS Trackers",
  ],
  "Υγιεινή Γάτας": [
    "Άμμοι-Πέλλετ",
    "Τουαλέτες",
    "Φτυάρια",
    "Catnip-Γρασίδι",
    "Σακούλες Απορριμμάτων",
    "Αντιπαρασιτικά Γάτας",
    "Κολάρα",
    "Αρωματικά άμμου",
    "Προϊόντα Καθαρισμού Χώρου",
  ],
  "Περιποίηση Γάτας": [
    "Τρίχωμα & Δέρμα",
    "Δόντια & Αναπνοή",
    "Νύχια & Πατούσες",
    "Αυτιά & Μάτια",
    "Μαντηλάκια",
    "Σαμπουάν",
    "Μαλακτικά & Αρώματα",
    "Αnti-Stress",
  ],
  "Τροφές Little Pet": ["Κύρια τροφή", "Λιχουδιές", "Χόρτα"],
  "Αξεσουάρ Little Pet": [
    "Κλουβιά",
    "Κλουβιά μεταφοράς",
    "Ταΐστρες-Σουπλά",
    "Ποτίστρες",
    "Παιχνίδια",
    "Σαμαράκια",
    "Εσωτερική διακόσμηση",
  ],
  "Υγιεινή Little Pet": [
    "Άμμοι Υποστρώματα",
    "Είδη καθαρισμού ζώου",
    "Είδη καθαρισμού κλουβιού",
    "Νυχοκόπτες-Βούρτσες",
    "Τουαλέτες",
  ],
  "Υγεία Little Pet": ["Συμπληρώματα διατροφής"],
  "Τροφές Bird": ["Κύρια τροφή", "Λιχουδιές", "Βιταμίνες"],
  "Υγεία Bird": ["Συμπληρώματα διατροφής"],
  "Αξεσουάρ Bird": [
    "Κλουβιά & Ορθοστάτες",
    "Ταΐστρες & Αυγοθήκες",
    "Ποτίστρες",
    "Παιχνίδια",
    "Φωλιές",
    "Κλαδιά",
    "Μπανιέρες",
  ],
  "Υγιεινή Bird": [
    "Άμμοι",
    "Υποστρώματα",
    "Νυχοκόπτες",
    "Προστατευτικά χώρου",
  ],
  "Τροφές Fish": ["Τροπικά Ψάρια", "Θαλασσινά ψάρια", "Χρυσόψαρα-Κόι"],
  "Αξεσουάρ Fish": [
    "Ενυδρεία-Βάσεις ενυδρείων",
    "Αντλίες Αέρα",
    "Φίλτρα-Υλικά φιλτραρίσματος",
    "Φωτισμός-Θερμότητα",
    "Αντλίες νερού-Κυκλοφορητές",
    "Διακοσμητικά",
    "Διακοσμητικά χαλίκια",
    "Βότσαλα",
    "Απόχες",
    "Γενικός εξοπλισμός",
    "Θερμόμετρα",
  ],
  "Φροντίδα-Υγιεινή Fish": [
    "Φάρμακα",
    "Βελτιώσεις νερού ενυδρείων",
    "Βελτιώσεις νερού λιμνών",
    "Λιπάσματα-Υποστρώματα",
    "Είδη καθαρισμού",
    "Σετ τεστ",
  ],
  "Τροφές Reptile": ["Κύρια τροφή"],
  "Αξεσουάρ Reptile": [
    "Χελωνιέρες",
    "Φωτισμός-Θερμότητα",
    "Θερμόμετρα & Υδρόμετρα",
  ],
  "Υγιεινή & Υγεία Reptile": [
    "Φάρμακα",
    "Συμπληρώματα διατροφής",
    "Υποστρώματα",
  ],
};

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
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    productImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product.category) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        productImageUrl:
          categoryImages[product.category] || "default-image-url",
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
    return (
      product.title &&
      product.code &&
      product.price &&
      product.category &&
      product.category2 &&
      product.subcategory &&
      product.description
    );
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
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, productData);
      toast.success("Product added successfully");
      navigate("/admin-dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const backgroundImageUrl =
    "https://t3.ftcdn.net/jpg/04/81/85/46/360_F_481854656_gHGTnBscKXpFEgVTwAT4DL4NXXNhDKU9.jpg";

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading && <Loader />}
      {!loading && (
        <div
          className="login_Form px-10 border border-blue-100 rounded-xl shadow-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <div className="mb-5">
            <h2 className="text-center text-2xl font-bold text-blue-500 ">
              Add Product
            </h2>
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              placeholder="Product Title"
              className="bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="code"
              value={product.code}
              onChange={(e) =>
                setProduct({ ...product, code: e.target.value })
              }
              placeholder="Product Code"
              className="bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
              placeholder="Product Price"
              className="bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300"
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              name="productImageFile"
              onChange={handleImageFileChange}
              className="bg-blue-50 border text-blue-300 border-blue-200 px-2 py-2 w-96 rounded-md outline-none placeholder-blue-300"
            />
          </div>
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-56 h-50 object-cover rounded-md"
              />
            </div>
          )}
          <div className="mb-3 flex gap-4">
            <select
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value, category2: "", subcategory: "" })
              }
              className="w-1/2 px-1 py-2 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none"
            >
              <option disabled value="">Select Category</option>
              {categoryList.map((value, index) => (
                <option
                  className="first-letter:uppercase"
                  key={index}
                  value={value.name}
                >
                  {value.name}
                </option>
              ))}
            </select>
            <select
              value={product.category2}
              onChange={(e) =>
                setProduct({ ...product, category2: e.target.value, subcategory: "" })
              }
              className="w-1/2 px-1 py-2 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none"
              disabled={!product.category}
            >
              <option disabled value="">Select Product Category</option>
              {category2List[product.category]?.map((value, index) => (
                <option
                  className="first-letter:uppercase"
                  key={index}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <select
              value={product.subcategory}
              onChange={(e) =>
                setProduct({ ...product, subcategory: e.target.value })
              }
              className="w-full px-1 py-2 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none"
              disabled={!product.category2}
            >
              <option disabled value="">Select Sub Category</option>
              {subcategoryList[product.category2]?.map((value, index) => (
                <option
                  className="first-letter:uppercase"
                  key={index}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              name="description"
              placeholder="Product Description"
              rows="5"
              className="w-full px-2 py-1 text-blue-300 bg-blue-50 border border-blue-200 rounded-md outline-none placeholder-blue-300"
            />
          </div>
          <div className="mb-3">
            <button
              onClick={addProductFunction}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 w-full text-white text-center py-2 font-bold rounded-md"
            >
              Add Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
