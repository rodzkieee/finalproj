import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LoginSignup.css";

const LoginSignup = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Toggle between Login and Signup forms
    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    // Handle Signup Form Submission
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
            alert(`Signup Failed. ${error.message || "Please try again later."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Login Form Submission
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
                const userData = {
                    userID: data.user.userID,
                    username: data.user.username,
                    name: data.user.name,
                    email: data.user.email,
                    role: data.user.role,
                };

                if (data.user.role === "Admin") {
                    localStorage.setItem("admin", JSON.stringify(userData));
                    navigate("/shoes");
                } else if (data.user.role === "Customer") {
                    localStorage.setItem("user", JSON.stringify(userData));
                    navigate("/LandingPage2");
                } else {
                    alert("Unknown role. Please contact support.");
                }
            } else {
                alert(`Login Failed: ${data.message || "Invalid credentials"}`);
            }
        } catch (error) {
            alert(`Login Failed. ${error.message || "Please try again later."}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-login">
            <div className="form-container">
                <div className="logo-login">
                    <img src="images/logo1.png" className="logo-login" alt="Logo" />
                </div>
                <h2>{showLogin ? "Welcome Back" : "Create Your Account"}</h2>

                {showLogin ? (
                    // Login Form
                    <form className="login-form" onSubmit={handleLogin}>
                        <input name="email" type="email" placeholder="Email" className="login-input" required />
                        <input name="password" type="password" placeholder="Password" className="login-input" required />
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
                    // Signup Form
                    <form className="signup-form" onSubmit={handleSignup}>
                        <input name="username" type="text" placeholder="Username" className="signup-input" required />
                        <input name="name" type="text" placeholder="Full Name" className="signup-input" required />
                        <input name="email" type="email" placeholder="Email" className="signup-input" required />
                        <input name="password" type="password" placeholder="Password" className="signup-input" required />
                        <input name="address" type="text" placeholder="Address" className="signup-input" required />
                        <input name="phoneNumber" type="tel" placeholder="Phone Number" className="signup-input" required />
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
