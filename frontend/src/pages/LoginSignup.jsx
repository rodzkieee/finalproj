import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);

        try {
            const response = await fetch("http://localhost:8800/signup", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup Successful!");
                e.target.reset(); 
                navigate("/LoginSignup");
            } else {
                alert(`Signup Failed: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Signup Failed. ${error.message || "Please try again later."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target);
    
        try {
            const response = await fetch("http://localhost:8800/login", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Login Successful!");
                
                // Save user info to localStorage
                localStorage.setItem("user", JSON.stringify(data.user)); // Assuming the user info is in `data.user`
    
                // Check the role from the response data
                if (data.user.role === "Admin") {
                    navigate("/shoes"); // Redirect to admin page
                } else if (data.user.role === "Customer") {
                    navigate("/LandingPage2"); // Redirect to customer page
                } else {
                    alert("Unknown role. Please contact support.");
                }
            } else {
                alert(`Login Failed: ${data.message || "Invalid credentials"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Login Failed. ${error.message || "Please try again later."}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    
    
    return (
        <div className="container">
            <div className="form-container">
                <div className="logo">
                    <img src="images/logo.png" className="logo" alt="Logo" />
                </div>
                <h2>{showLogin ? "Welcome Back" : "Create Your Account"}</h2>

                {showLogin ? (
                    <form className="login-form" onSubmit={handleLogin}>
                        <input name="email" type="email" placeholder="Email" required />
                        <input name="password" type="password" placeholder="Password" required />
                        <button type="submit" className="btn" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                        <p className="switch">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="link-button"
                            >
                                Sign Up
                            </button>
                        </p>
                    </form>
                ) : (
                    <form className="signup-form" onSubmit={handleSignup}>
                        <input name="username" type="text" placeholder="Username" required />
                        <input name="name" type="text" placeholder="Full Name" required />
                        <input name="email" type="email" placeholder="Email" required />
                        <input name="password" type="password" placeholder="Password" required />
                        <input name="address" type="text" placeholder="Address" required />
                        <input name="phoneNumber" type="tel" placeholder="Phone Number" required />
                        <button type="submit" className="btn" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </button>
                        <p className="switch">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="link-button"
                            >
                                Login
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;
