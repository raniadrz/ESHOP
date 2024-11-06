import { Toaster } from "react-hot-toast";
import 'semantic-ui-css/semantic.min.css';

import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import BulkProducts from "./components/admin/BulkProducts";
import Products from "./components/homePageProductCard/HomePageProductCard";
import ScrollTop from "./components/scrollTop/ScrollTop";
import UserSettings from './components/user/ProfileDetail';
import MyState from "./context/myState";
import AddProduct from "./pages/admin/AddProductPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UpdateProductPage from "./pages/admin/UpdateProductPage";
import Cart from "./pages/cart/CartPageNav";
import CategoryPage from "./pages/category/CategoryPage";
import About from "./pages/footer/about/About";
import Contact from "./pages/footer/contact/Contact";
import PPolicy from "./pages/footer/privacyPolicy/privacyPolicy";
import ReturnPolicy from './pages/footer/returnPolicy/ReturnPolicy';
import HomePage from "./pages/home/HomePage";
import NoPage from "./pages/noPage/NoPage";
import ProductInfo from "./pages/productInfo/ProductInfo";
import Login from "./pages/registration/Login";
import Signup from "./pages/registration/Signup";
import { ProtectedRouteForAdmin } from "./protectedRoute/ProtectedRouteForAdmin";
import { ProtectedRouteForUser } from "./protectedRoute/ProtectedRouteForUser";

function App() {
  return (
    <MyState>
      <Router>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
          <Route path="products" element={<Products/>} />
          <Route path="/privacypolicy" element={<PPolicy />} />
          <Route path="/returnpolicy" element={<ReturnPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/cartNav" element={<Cart />} />
          <Route path="/productinfo/:id" element={<ProductInfo />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category/:categoryname" element={<CategoryPage />} />

          <Route path="/user-dashboard" element={
            <ProtectedRouteForUser>
              <UserSettings />
            </ProtectedRouteForUser>
          } />

          <Route path="/add/product" element={
            <ProtectedRouteForAdmin>
              <AddProduct />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/bulk-products" element={
            <ProtectedRouteForAdmin>
              <BulkProducts />
            </ProtectedRouteForAdmin>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRouteForAdmin>
              <AdminDashboard />
            </ProtectedRouteForAdmin>
          } />
         
          <Route path="/updateproduct/:id" element={
            <ProtectedRouteForAdmin>
              <UpdateProductPage />
            </ProtectedRouteForAdmin>
          } />
          <Route path="/admin-settings" element={
            <ProtectedRouteForAdmin>
              <UserSettings />
            </ProtectedRouteForAdmin>
          } />
        </Routes>
        <Toaster />
      </Router>
      
    </MyState>
  );
}

export default App;
