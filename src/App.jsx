import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import PostalWorkerManagement from './pages/admin/PostalWorkerManagement'
import PostalLogin from './pages/postal/PostalLogin'
import PostalRegister from './pages/postal/PostalRegister'
import PostalDashboard from './pages/postal/PostalDashboard'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { PostalAuthProvider } from './context/PostalAuthContext'

function App() {
    return (
        <AuthProvider>
            <PostalAuthProvider>
                <CartProvider>
                    <div className="app">
                        <Navbar />
                        <main style={{ flex: 1 }}>
                            <Routes>
                                {/* Customer Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />

                                {/* Admin Routes */}
                                <Route path="/admin" element={<AdminLogin />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/products" element={<ProductManagement />} />
                                <Route path="/admin/orders" element={<OrderManagement />} />
                                <Route path="/admin/postal-workers" element={<PostalWorkerManagement />} />

                                {/* Postal Worker Routes */}
                                <Route path="/postal" element={<PostalLogin />} />
                                <Route path="/postal/register" element={<PostalRegister />} />
                                <Route path="/postal/dashboard" element={<PostalDashboard />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </CartProvider>
            </PostalAuthProvider>
        </AuthProvider>
    )
}

export default App
