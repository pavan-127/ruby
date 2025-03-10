import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Category() {
    const cart = useSelector(state => state.cart);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const navigate = useNavigate();

    const [currentLocation, setCurrentLocation] = useState("Fetching location...");
    const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("username") || null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        const city = data.address.city || data.address.town || data.address.village || "Unknown City";
                        const mandal = data.address.county || data.address.suburb || "Unknown Mandal";

                        setCurrentLocation(`${city}, ${mandal}`);
                    } catch (error) {
                        setCurrentLocation("Unable to fetch location");
                    }
                },
                () => setCurrentLocation("Location permission denied")
            );
        } else {
            setCurrentLocation("Geolocation not supported");
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setLoggedInUser(localStorage.getItem("username"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        setLoggedInUser(null);
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center px-3">
                    
                    {/* Logo */}
                    <Link className="navbar-brand fw-bold text-danger" to="/Home">
                        🍽️ Foodie Buddie
                    </Link>

                    {/* Location */}
                    <span className="text-light d-none d-md-inline">📍 {currentLocation}</span>

                    {/* Navigation Links (Always Visible) */}
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <Link className="nav-link text-light fw-bold" to="/Home">🏠 Home</Link>
                        <Link className="nav-link text-success fw-bold" to="/veg-items">🥦 Veg</Link>
                        <Link className="nav-link text-danger fw-bold" to="/non-veg-items">🍗 Non-Veg</Link>
                        <Link className="nav-link text-warning fw-bold" to="/dessert">🍰 Desserts</Link>
                        <Link className="nav-link text-light fw-bold" to="/orders">📦 Orders</Link>
                        <Link className="nav-link text-light fw-bold" to="/about-us">ℹ️ About Us</Link>
                        <Link className="nav-link text-light fw-bold" to="/contact-us">📞 Contact Us</Link>
                    </div>

                    {/* User & Cart Section */}
                    <div className="d-flex align-items-center gap-3">
                        {!loggedInUser ? (
                            <Link to="/login" className="btn btn-outline-light">🔑 Login</Link>
                        ) : (
                            <div className="dropdown">
                                <button className="btn btn-warning d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                                    <img src="/image/Login.png" alt="" className="login-icon me-2" />
                                    {loggedInUser}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>
                                            🚪 Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="btn btn-warning position-relative">
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}

export { Category };
