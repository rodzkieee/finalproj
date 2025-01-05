import { Link } from "react-router-dom";
import "./LandingPage.css";
import React, { useState } from "react";

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState("images/img1.png"); 
  const [circleColor, setCircleColor] = useState("#017143"); 

  const handleImageChange = (imagePath, color) => {
    setCurrentImage(imagePath);
    setCircleColor(color);
  };

  return (
    <div>
        <div className="main-header">
          <a href="/">
            <img src="images/logo.png" className="logo" alt="Logo" />
          </a>
          <div className="toggle" />
          <ul className="navigation">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Product">Product</Link>
            </li>
            <li>
              <Link to="/LoginSignup">Login</Link>
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

export default LandingPage;