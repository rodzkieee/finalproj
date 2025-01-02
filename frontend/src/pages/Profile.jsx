import { Link } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser?.username) {
            fetchUserInfo(storedUser.username);
        } else {
            setError("No user found. Please log in.");
            setLoading(false);
        }
    }, []);

    const fetchUserInfo = async (username) => {
        try {
            const response = await fetch(`http://localhost:8800/user/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user info. Status: ${response.status}`);
            }

            const data = await response.json();

            // Validate the fetched username matches the local storage username
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (data.username === storedUser.username) {
                setUser(data);
            } else {
                throw new Error("User data mismatch. Please log in again.");
            }
        } catch (err) {
            console.error("Error fetching user info:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to update your profile information?")) {
            return;
        }

        const formData = new FormData(e.target);
        const updatedData = Object.fromEntries(formData);
        updatedData.email = user.email; // Include email in the request

        if (!updatedData.password) {
            delete updatedData.password;
        }

        try {
            const response = await fetch(`http://localhost:8800/user`, {
                method: "PUT",
                body: JSON.stringify(updatedData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update user profile.");
            }

            alert("Profile updated successfully.");
            fetchUserInfo(user.username);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8800/user`, {
                method: "DELETE",
                body: JSON.stringify({ email: user.email }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete account.");
            }

            alert("Account deleted successfully.");
            localStorage.removeItem("user");
            window.location.href = "/LoginSignup";
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <h1>My Profile</h1>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <span className="static-field">{user?.username || "N/A"}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" defaultValue={user?.name || ""} required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <span className="static-field">{user?.email || "N/A"}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter a new password (optional)" />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" defaultValue={user?.address || ""} />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" defaultValue={user?.phoneNumber || ""} />
                </div>

                <div className="buttons">
                    <button type="submit" className="update-btn">Update Profile</button>
                    <button type="button" className="delete-btn" onClick={handleDelete}>Delete Account</button>
                </div>
                <div className="back-button">
                <Link to="/LandingPage2" className="back-btn">Back</Link>
            </div>
            </form>
        </div>
    );
};

export default Profile;
