import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button, Form, Header, Segment, Step } from "semantic-ui-react";
import CustomToast from '../../components/CustomToast/CustomToast';
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/FirebaseConfig';

const categoryList = [
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Little Pet' },
    { name: 'Bird' },
    { name: 'Fish' },
    { name: 'Reptile' },
];

const subCategoryList = [
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
        productType: "New Product",
        stock: "",
    });

    const [step, setStep] = useState(1); // Track the current step
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        getSingleProductFunction();
    }, [id]);

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
                    productType: productData.productType || "New Product",
                    stock: productData.stock || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to fetch product data.");
        } finally {
            setLoading(false);
        }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            let updatedProduct = { ...product };

            if (imageFile) {
                const imageRef = ref(storage, `products/${Date.now() + imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                const imageUrl = await getDownloadURL(imageRef);
                updatedProduct.productImageUrl = imageUrl;
            }

            await setDoc(doc(fireDB, 'products', id), updatedProduct);
            showCustomToast('success', 'Product updated successfully');
            getAllProductFunction();
            navigate('/admin-dashboard');
        } catch (error) {
            console.error("Error updating product:", error);
            showCustomToast('error', 'Failed to update product');
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
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
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
                <Segment style={{ maxWidth: '600px', width: '100%' }}>
                    <Header as="h2" textAlign="center" color="pink">
                        Update Product
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
                            <Form.Field>
                                <label>Product Image</label>
                                <div style={{ marginBottom: '1rem' }}>
                                    {(imagePreview || product.productImageUrl) && (
                                        <img 
                                            src={imagePreview || product.productImageUrl} 
                                            alt="Product preview" 
                                            style={{ 
                                                maxWidth: '200px', 
                                                marginBottom: '1rem',
                                                display: 'block' 
                                            }} 
                                        />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </Form.Field>
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
                                            ? subCategoryList.map((sub) => ({
                                                key: sub.name,
                                                text: sub.name,
                                                value: sub.name,
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
                            <Form.Input
                                fluid
                                label="Sub-subcategory"
                                placeholder="Sub-subcategory"
                                value={product.subcategory}
                                onChange={(e) =>
                                    setProduct({ ...product, subcategory: e.target.value })
                                }
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
                            <p><strong>Stock:</strong> {product.stock}</p>
                            <Button.Group fluid>
                                <Button onClick={prevStep} secondary>
                                    Back
                                </Button>
                                <Button onClick={updateProduct} positive>
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

export default UpdateProductPage;
