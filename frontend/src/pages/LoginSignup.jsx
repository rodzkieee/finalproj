import React, { useState } from "react";
/*import { Link } from "react-router-dom";*/
import "./LoginSignup.css";

const LoginSignup = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="container">
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login &amp; Signup</title>
      <div className="form-container">
        <div className="logo">
          <img src="images/logo.png" className="logo" alt="Logo" />
        </div>
        <h2>{showLogin ? "Welcome Back" : "Create Your Account"}</h2>

        {showLogin && (
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn">Login</button>
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
        )}

        {!showLogin && (
          <form className="signup-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="btn">Sign Up</button>
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
