import { Link, useNavigate } from "react-router-dom";
import "./LandingPage2.css";
import React, { useState, useEffect } from "react";

const LandingPage2 = () => {
  const [currentImage, setCurrentImage] = useState("images/img1.png");
  const [circleColor, setCircleColor] = useState("#017143");
  const [user, setUser] = useState(null); // Store user info
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch user info from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleImageChange = (imagePath, color) => {
    setCurrentImage(imagePath);
    setCircleColor(color);
  };

// Function to handle logout with confirmation
const logout = (event) => {
  // Prevent the default link behavior
  event.preventDefault();

  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem("user");
    setUser(null); // Reset user state
    navigate("/"); 
  }
};


  return (
    <div>
          <div className="header2">
              <a href="/">
                <img src="images/logo.png" className="logo-landing" alt="Logo" />
              </a>
              <div className="toggle" />
              <ul className="navigation">
                <li>
                  <Link to="/Product">Product</Link>
                </li>
                <li>
                  {user ? (
                    <Link to="/Profile">Welcome, {user.username || user.name}</Link>
                  ) : (
                    <Link to="/LoginSignup">Login</Link>
                  )}
                </li>
                <li>
                {user ? (
                  <Link to="/" onClick={(event) => logout(event)}>Logout</Link> // Logout option
                ) : (
                  <Link to="/LoginSignup"></Link>
                )}
                </li>
              </ul>
            </div>

      <section>
        <div className="circle" style={{ background: circleColor }} />

        <div className="content">
          <div className="textBox">
            <h2>
              It's not just Coffee <br />
              It's <span>Starbucks</span>
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero
              ipsum voluptate minima voluptatum distinctio ipsam totam ullam,
              repudiandae quam quos itaque exercitationem at rerum placeat ex
              sint eum dolore velit!
            </p>
            <a href="/">Learn More</a>
          </div>
          <div className="imgBox">
            <img src={currentImage} className="starbucks" alt="Starbucks" />
          </div>
        </div>

        <ul className="thumb">
          <li>
            <img
              src="images/thumb1.png"
              onClick={() => handleImageChange("images/img1.png", "#017143")}
              alt="Thumb 1"
            />
          </li>
          <li>
            <img
              src="images/thumb2.png"
              onClick={() => handleImageChange("images/img2.png", "#eb7495")}
              alt="Thumb 2"
            />
          </li>
          <li>
            <img
              src="images/thumb3.png"
              onClick={() => handleImageChange("images/img3.png", "#d752b1")}
              alt="Thumb 3"
            />
          </li>
        </ul>

        <ul className="sci">
          <li>
            <a href="/">
              <img src="images/facebook.png" alt="Facebook" />
            </a>
          </li>
          <li>
            <a href="/">
              <img src="images/twitter.png" alt="Twitter" />
            </a>
          </li>
          <li>
            <a href="/">
              <img src="images/instagram.png" alt="Instagram" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default LandingPage2;
