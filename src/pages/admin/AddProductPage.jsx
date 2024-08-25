import React, { useContext, useState, useEffect } from "react";
import { Button, Form, Grid, Header, Image, Segment, Step } from "semantic-ui-react";
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
  //... other categories and subcategories
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
  //... other subcategories
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
    productType: "New Product",
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
      console.error(error);
      toast.error("Failed to add product");
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
      {loading && <Loader />}
      {!loading && (
        <Segment style={{ maxWidth: "600px", width: "100%" }}>
          <Header as="h2" textAlign="center" color="blue">
            Add Product
          </Header>
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
