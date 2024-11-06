import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, IconButton } from '@mui/material';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import CustomToast from '../../../components/CustomToast/CustomToast';
import myContext from "../../../context/myContext";
import { fireDB } from "../../../firebase/FirebaseConfig";
import Loader from "../../loader/Loader";

const ProductDetail = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productType, setProductType] = useState("All Products");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let result = [...getAllProduct];

    if (searchTerm) {
      result = result.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase())
          
      );
    }

    if (productType !== "All Products") {
      result = result.filter(product => product.productType === productType);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "stock-asc":
        result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case "stock-desc":
        result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [getAllProduct, searchTerm, productType, sortBy]);

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

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, 'products', id));
      getAllProductFunction();
      showCustomToast('success', 'Product deleted successfully');
    } catch (error) {
      console.error(error);
      showCustomToast('error', 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(fireDB, 'products', id), {
        status: !currentStatus
      });
      showCustomToast('success', 'Product status updated successfully');
      getAllProductFunction();
    } catch (error) {
      showCustomToast('error', 'Failed to update product status');
    } finally {
      setLoading(false);
    }
  };

  const rows = filteredProducts.map((item, index) => ({
    id: item.id,
    serial: index + 1,
    image: item.productImageUrl,
    title: item.title,
    code: item.code,
    price: item.price,
    category: item.category,
    category2: item.category2,
    subcategory: item.subcategory,
    date: item.date,
    productType: item.productType || 'N/A', // Add productType to rows
    status: item.status ?? true, // Use existing status or default to true
    stock: item.stock || 0, // Use actual stock instead of random number
  }));

  const columns = [
    {
      field: 'image',
      headerName: 'Product info',
      flex: 2.5,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className="flex items-center gap-4">
          <img src={params.value} alt="product" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
          <div>
            <div className="font-semibold">{params.row.title}</div>
            <div className="text-gray-500">ID: {params.row.code}</div>
          </div>
        </div>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div>{params.value}€</div>
      )
    },
    {
      field: 'stock',
      headerName: 'Stock',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div>{params.value} units</div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <Switch
          checked={params.row.status}
          onChange={() => toggleProductStatus(params.row.id, params.row.status)}
          color="success"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton 
            onClick={() => deleteProduct(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton 
            onClick={() => navigate(`/updateproduct/{params.row.id}€`)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </div>
      )
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="p-6">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 1500,
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or code"
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-100"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="material-icons absolute left-3 top-2 text-gray-400"></span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <select 
            className="p-2 rounded-lg bg-gray-100"
            value={productType}
            onChange={handleProductTypeChange}
          >
            <option value="All Products">All Products</option>
            <option value="New Product">New Products</option>
            <option value="Sales">Sales</option>
            {/* <option value="Best Seller">Best Sellers</option> */}
          </select>

          <select 
            className="p-2 rounded-lg bg-gray-100"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>

          <Link to="/add/product">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddToPhotosIcon />}
            >
              Add new product
            </Button>
          </Link>
        </div>
      </div>

      {loading && <Loader />}

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'transparent',
            borderBottom: '2px solid #f0f0f0',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
}

export default ProductDetail;
