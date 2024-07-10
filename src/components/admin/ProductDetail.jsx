import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import { deleteDoc, doc } from "firebase/firestore";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../loader/Loader";

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
            setLoading(false);
        } catch (error) {
            console.log(error);
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
        date: item.date
    }));

    const columns = [
        { field: 'code', headerName: 'Code', flex: 1.5, headerAlign: 'center', align: 'center' },
        { field: 'title', headerName: 'Title', flex: 3, headerAlign: 'center', align: 'center', headerClassName: 'bold-header' },
        { field: 'category', headerName: 'Category', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'category2', headerName: 'Category2', flex: 2.5, headerAlign: 'center', align: 'center' },
        { field: 'subcategory', headerName: 'SubCategory', flex: 1.5, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'price', headerName: 'Price', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'image',
            headerName: 'Image',
            flex: 2.5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (<img src={params.value} alt="product" style={{ width: '100%' }} />)
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
                        <DeleteIcon style={{ color: 'blue' }} />
                    </IconButton>
                </div>
            )
        }
    ];

    return (
        <div style={{height: '80vh'}}>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-blue-300 font-bold">All Product</h1>
                <Link to={'/addproduct'}>
                    <button className="px-5 py-2 bg-blue-50 border border-blue-100 rounded-lg">Add Product</button>
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
                            backgroundColor: '#10acbe;',
                        },
                        '& .MuiDataGrid-cell': {
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#e0e0e0',
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                            textAlign: 'center',
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default ProductDetail;
