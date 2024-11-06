import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Grid, Header, Image, Segment, Step } from "semantic-ui-react";
import CustomToast from '../../components/CustomToast/CustomToast';
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
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
    "Μεταφορά-Διαμονή",
    "Αξεσουάρ",
    "Υγιεινή",
    "Περιποίηση",
  ],
  "Little Pet": [
    "Τροφές Μικρών Ζώων",
    "Κλουβιά & Σπίτια",
    "Αξεσουάρ",
    "Υγιεινή",
  ],
  Bird: [
    "Τροφές Πουλιών",
    "Κλουβιά & Σπίτια",
    "Αξεσουάρ",
    "Υγιεινή",
  ],
  Fish: [
    "Τροφές Ψαριών",
    "Ενυδρεία",
    "Αξεσουάρ",
    "Φιλτράρισμα & Συντήρηση",
  ],
  Reptile: [
    "Τροφές Ερπετών",
    "Τεραριούμ",
    "Αξεσουάρ",
    "Φιλτράρισμα & Συντήρηση",
  ],
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
  "Κλινικές Τροφές Σκύλου": [
    "Για αρθρώσεις",
    "Για πέψη",
    "Για δέρμα & τρίχωμα",
    "Για οδοντική υγεία",
  ],
  "Μεταφορά-Διαμονή": [
    "Μεταφορείς",
    "Σπίτια Σκύλων",
    "Κλουβιά Μεταφοράς",
  ],
  "Αξεσουάρ": [
    "Περιλαίμια",
    "Λουριά",
    "Παιχνίδια",
    "Κρεβάτια & Μαξιλάρια",
  ],
  "Υγιεινή": [
    "Σακούλες απορριμμάτων",
    "Πάνες",
    "Καθαριστικά",
    "Σαμπουάν & Μαλακτικά",
  ],
  "Περιποίηση": [
    "Βούρτσες",
    "Ψαλίδια",
    "Στεγνωτήρες",
  ],
  // Similar structure for "Cat"
  "Τροφές Γάτας": [
    "Ξηρά τροφή",
    "Υγρή Τροφή & Κονσέρβες",
    "Λιχουδιές",
    "Βιταμίνες-Συμπληρώματα διατροφής",
  ],
  "Κλινικές Τροφές Γάτας": [
    "Για αρθρώσεις",
    "Για πέψη",
    "Για δέρμα & τρίχωμα",
    "Για οδοντική υγεία",
  ],
  "Μεταφορά-Διαμονή": [
    "Μεταφορείς",
    "Σπίτια Γάτας",
    "Κλουβιά Μεταφοράς",
  ],
  "Αξεσουάρ": [
    "Περιλαίμια",
    "Λουριά",
    "Παιχνίδια",
    "Κρεβάτια & Μαξιλάρια",
  ],
  "Υγιεινή": [
    "Σακούλες απορριμμάτων",
    "Πάνες",
    "Καθαριστικά",
    "Σαμπουάν & Μαλακτικά",
  ],
  "Περιποίηση": [
    "Βούρτσες",
    "Ψαλίδια",
    "Στεγνωτήρες",
  ],
  // "Little Pet" subcategories
  "Τροφές Μικρών Ζώων": [
    "Ξηρά τροφή",
    "Σνακ",
  ],
  "Κλουβιά & Σπίτια": [
    "Κλουβιά",
    "Σπίτια",
  ],
  "Αξεσουάρ": [
    "Τροχοί",
    "Τσάντες μεταφοράς",
  ],
  "Υγιεινή": [
    "Πάνες",
    "Καθαριστικά",
  ],
  // "Bird" subcategories
  "Τροφές Πουλιών": [
    "Σπόροι",
    "Λιχουδιές",
  ],
  "Κλουβιά & Σπίτια": [
    "Κλουβιά",
    "Φωλιές",
  ],
  "Αξεσουάρ": [
    "Κρεμάστρες",
    "Παιχνίδια",
  ],
  "Υγιεινή": [
    "Καθαριστικά",
    "Σαμπουάν",
  ],
  // "Fish" subcategories
  "Τροφές Ψαριών": [
    "Νιφάδες",
    "Σφαιρίδια",
  ],
  "Ενυδρεία": [
    "Γυάλες",
    "Φυτά & Διακοσμητικά",
  ],
  "Αξεσουάρ": [
    "Φίλτρα",
    "Θερμαντήρες",
  ],
  "Φιλτράρισμα & Συντήρηση": [
    "Φίλτρα",
    "Καθαριστικά",
  ],
  // "Reptile" subcategories
  "Τροφές Ερπετών": [
    "Ζωντανή Τροφή",
    "Ξηρά Τροφή",
  ],
  "Τεραριούμ": [
    "Διακοσμητικά",
    "Φυτά",
  ],
  "Αξεσουάρ": [
    "Θερμοστάτες",
    "Λάμπες UVB",
  ],
  "Φιλτράρισμα & Συντήρηση": [
    "Φίλτρα",
    "Καθαριστικά",
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
    stock: "",
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
    productType: "New Product",
    status: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [step, setStep] = useState(1); // Track current step

  useEffect(() => {
    if (product.category) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        productImageUrl: categoryImages[product.category] || "default-image-url",
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

  const showCustomToast = (type, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          type={type}
          message={message}
          onClose={() => {
            toast.dismiss(t.id);
          }}
        />
      ),
      {
        duration: 1500,
        position: 'bottom-center',
        id: `${type}-${Date.now()}`,
      }
    );
  };

  const addProductFunction = async () => {
    if (!isValidProduct(product)) {
      showCustomToast('error', 'All fields are required');
      return;
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
      showCustomToast('success', 'Product added successfully');
      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      showCustomToast('error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div
      style={{
        backgroundImage: `url(https://t3.ftcdn.net/jpg/04/81/85/46/360_F_481854656_gHGTnBscKXpFEgVTwAT4DL4NXXNhDKU9.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 1500,
        }}
      />
      {loading && <Loader />}
      {!loading && (
        <Segment style={{ maxWidth: "600px", width: "100%" }}>
          <Grid columns={2} style={{ marginBottom: '1rem' }}>
            <Grid.Column>
              <Header as="h2" color="blue">
                Add Product
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button
                as={Link}
                to="/bulk-products"
                color="green"
                size="small"
              >
                Bulk Upload
              </Button>
            </Grid.Column>
          </Grid>
          <Step.Group fluid>
            <Step active={step === 1}>
              <Step.Content>
                <Step.Title>Basic Info</Step.Title>
              </Step.Content>
            </Step>
            <Step active={step === 2}>
              <Step.Content>
                <Step.Title>Category</Step.Title>
              </Step.Content>
            </Step>
            <Step active={step === 3}>
              <Step.Content>
                <Step.Title>Details</Step.Title>
              </Step.Content>
            </Step>
            <Step active={step === 4}>
              <Step.Content>
                <Step.Title>Review</Step.Title>
              </Step.Content>
            </Step>
          </Step.Group>

          {step === 1 && (
            <Form>
              <Form.Input
                fluid
                label="Product Title"
                placeholder="Product Title"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
              />
              <Form.Input
                fluid
                label="Product Code"
                placeholder="Product Code"
                value={product.code}
                onChange={(e) =>
                  setProduct({ ...product, code: e.target.value })
                }
              />
              <Form.Input
                fluid
                label="Product Price"
                placeholder="Product Price"
                type="number"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
              <Form.Input
                fluid
                label="Stock"
                placeholder="Product Stock"
                type="number"
                min="0"
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: parseInt(e.target.value) || 0 })
                }
              />
              <Button onClick={nextStep} primary fluid>
                Next
              </Button>
            </Form>
          )}

          {step === 2 && (
            <Form>
              <Form.Group widths="equal">
                <Form.Select
                  fluid
                  label="Category"
                  options={categoryList.map((category) => ({
                    key: category.name,
                    text: category.name,
                    value: category.name,
                  }))}
                  placeholder="Select Category"
                  value={product.category}
                  onChange={(e, { value }) =>
                    setProduct({
                      ...product,
                      category: value,
                      category2: "",
                      subcategory: "",
                    })
                  }
                />
                <Form.Select
                  fluid
                  label="Subcategory"
                  options={
                    product.category
                      ? category2List[product.category]?.map((subcategory) => ({
                          key: subcategory,
                          text: subcategory,
                          value: subcategory,
                        }))
                      : []
                  }
                  placeholder="Select Subcategory"
                  value={product.category2}
                  onChange={(e, { value }) =>
                    setProduct({
                      ...product,
                      category2: value,
                      subcategory: "",
                    })
                  }
                  disabled={!product.category}
                />
              </Form.Group>
              <Form.Select
                fluid
                label="Sub-subcategory"
                options={
                  product.category2
                    ? subcategoryList[product.category2]?.map((subsub) => ({
                        key: subsub,
                        text: subsub,
                        value: subsub,
                      }))
                    : []
                }
                placeholder="Select Sub-subcategory"
                value={product.subcategory}
                onChange={(e, { value }) =>
                  setProduct({ ...product, subcategory: value })
                }
                disabled={!product.category2}
              />
              <Button.Group fluid>
                <Button onClick={prevStep} secondary>
                  Back
                </Button>
                <Button onClick={nextStep} primary>
                  Next
                </Button>
              </Button.Group>
            </Form>
          )}

          {step === 3 && (
            <Form>
              <Form.TextArea
                label="Product Description"
                placeholder="Product Description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
              <Form.Input
                fluid
                label="Upload Image"
                type="file"
                onChange={handleImageFileChange}
              />
              {imagePreview && (
                <Segment>
                  <Image src={imagePreview} size="small" rounded centered />
                </Segment>
              )}
              <Form.Group inline>
                <label>Product Type:</label>
                <Form.Radio
                  label="New Product"
                  value="New Product"
                  checked={product.productType === "New Product"}
                  onChange={(e, { value }) =>
                    setProduct({ ...product, productType: value })
                  }
                />
                <Form.Radio
                  label="Sales"
                  value="Sales"
                  checked={product.productType === "Sales"}
                  onChange={(e, { value }) =>
                    setProduct({ ...product, productType: value })
                  }
                />
              </Form.Group>
              <Button.Group fluid>
                <Button onClick={prevStep} secondary>
                  Back
                </Button>
                <Button onClick={nextStep} primary>
                  Next
                </Button>
              </Button.Group>
            </Form>
          )}

          {step === 4 && (
            <Segment>
              <Header as="h3">Review Your Product</Header>
              <p><strong>Title:</strong> {product.title}</p>
              <p><strong>Code:</strong> {product.code}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Subcategory:</strong> {product.category2}</p>
              <p><strong>Sub-subcategory:</strong> {product.subcategory}</p>
              <p><strong>Description:</strong> {product.description}</p>
              {imagePreview && <Image src={imagePreview} size="small" rounded centered />}
              <Button.Group fluid>
                <Button onClick={prevStep} secondary>
                  Back
                </Button>
                <Button onClick={addProductFunction} positive>
                  Submit
                </Button>
              </Button.Group>
            </Segment>
          )}
        </Segment>
      )}
    </div>
  );
};

export default AddProductPage;
