import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/ProductForm";
import Logout from "./components/Logout";
import { AuthProvider } from './components/AuthContext';
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckOutPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import OrdersPage from "./components/OrdersPage";
import OrderDetailPage from "./components/OrderDetailPage";
import Navbar from "./components/NavBar";
import SearchResults from "./components/SearchResults";
function App() {
    return ( 
        <AuthProvider>

        <Router>
        <Navbar /> 

            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/order/:orderId" element={<OrderDetailPage />} />
                <Route path="/search" element={<SearchResults />} />

            </Routes>

        </Router>
        </AuthProvider>

    );
}

export default App;
