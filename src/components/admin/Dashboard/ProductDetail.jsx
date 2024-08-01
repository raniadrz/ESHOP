import React, { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../../context/myContext";
import { fireDB } from "../../../firebase/FirebaseConfig";
import Loader from "../../loader/Loader";

const ProductDetail = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, 'products', id));
      toast.success('Product Deleted successfully');
      getAllProductFunction();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const rows = getAllProduct.map((item, index) => ({
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
  }));

  const columns = [
    { field: 'code', headerName: 'Code', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'title', headerName: 'Title', flex: 3, headerAlign: 'center', align: 'center', headerClassName: 'bold-header' },
    { field: 'category', headerName: 'Breed', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'category2', headerName: 'Category', flex: 2.5, headerAlign: 'center', align: 'center' },
    { field: 'subcategory', headerName: 'SubCategory', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'price', headerName: 'Price', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'image',
      headerName: 'Image',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img src={params.value} alt="product" style={{ width: '50%', borderRadius: '40px' }} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => navigate(`/updateproduct/${params.row.id}`)}>
            <EditIcon style={{ color: 'green' }} />
          </IconButton>
          <IconButton onClick={() => deleteProduct(params.row.id)}>
            <DeleteIcon style={{ color: 'red' }} />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <div style={{ height: '80vh' }}>
      <div className="py-5 flex justify-between items-center">
        <h1 className="text-xl text-blue-600 font-bold">All Products</h1>
        <Link to={'/addproduct'}>
          <button className="flex items-center px-5 py-2 bg-blue-500 text-white border border-blue-500 rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-all duration-200">
            <AddCircleOutlineIcon className="mr-2" />
            Add Product
          </button>
        </Link>
      </div>

      <div className="flex justify-center relative top-20">
        {loading && <Loader />}
      </div>

      <div className="w-full mb-5" style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: '#005689', // Light blue background
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#2196f3', // Blue header background
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              color: '#ffffff', // White text in headers
              textAlign: 'center',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#d5eeff', // Alternate row color
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
