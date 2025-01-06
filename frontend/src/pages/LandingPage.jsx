import { Link } from "react-router-dom";
import "./LandingPage.css";
import React, { useState } from "react";


const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState("images/wine.png"); 
  const [circleColor, setCircleColor] = useState("#017143"); 

  const handleImageChange = (imagePath, color) => {
    setCurrentImage(imagePath);
    setCircleColor(color);
  };

  return (
    <div>
        <div className="main-header">
          <a href="/">
            <img src="images/logo1.png" className="logo" alt="Logo" />
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
            <img src={currentImage}  className="starbucks" alt="Starbucks" />
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

export default LandingPage;