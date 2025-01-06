import { Link, useNavigate } from "react-router-dom";
import "./LandingPage2.css";
import React, { useState, useEffect } from "react";

const LandingPage2 = () => {
  const [currentImage, setCurrentImage] = useState("images/wine.png");
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
                <img src="images/logo1.png" className="logo-landing" alt="Logo" />
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
              It's not just Wine <br />
              It's <span>Emerald Vineyard</span>
            </h2>
            <p>
            At Emerald Vineyard, every bottle tells a story of dedication and sustainability. 
            Our grapes are nurtured in sun-drenched, emerald-green fields, 
            where fertile soil and careful cultivation come together to produce wines of unparalleled depth and character.
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
              src="images/wine.png"
              onClick={() => handleImageChange("images/wine.png", "#017143")}
              alt="Thumb 1"
            />
          </li>
          <li>
            <img
              src="images/wine7.png"
              onClick={() => handleImageChange("images/wine7.png", "#011991")}
              alt="Thumb 2"
            />
          </li>
          <li>
            <img
              src="images/wine3.png"
              onClick={() => handleImageChange("images/wine3.png", "#a10000")}
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
