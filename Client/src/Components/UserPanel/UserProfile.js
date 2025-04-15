import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../Styles/UserProfile.css';

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const [email, setEmail] = useState(storedUser.email);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(
    storedUser.profileImage || 'https://www.w3schools.com/howto/img_avatar.png'
  );

  const fileInputRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        'http://localhost:4000/api/users/update',
        { email, password },
        {
          headers: { Authorization: token }
        }
      );

      setMessage(res.data.msg);
      const updatedUser = { ...storedUser, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Update error:", err.response || err);
      setMessage(err.response?.data?.msg || "Error updating profile");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.put(
        "http://localhost:4000/api/users/upload-image",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = res.data.profileImage;
      setProfileImage(imageUrl);

      const updatedUser = { ...storedUser, profileImage: imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile image updated!");
    } catch (err) {
      console.error("Upload error:", err.response || err);
      setMessage("Error uploading image");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>
      <div className="profile-content">
        {/* Profile Image Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar" onClick={handleImageClick}>
            <img src={profileImage} alt="Avatar" />
            <div className="avatar-btn"></div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <p className="avatar-hint">For best results, use a round image</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Change your password"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="update-btn">Update</button>
          </div>

          {message && <p className="profile-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
