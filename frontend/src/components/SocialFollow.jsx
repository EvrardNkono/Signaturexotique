import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'; // Utilisation de FaTiktok
import { SiSnapchat } from 'react-icons/si';
import './SocialFollow.css';

const SocialFollow = () => {
  return (
    <div className="social-follow">
      <a href="https://www.facebook.com/tonPage" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="social-icon" />
      </a>
      <a href="https://www.snapchat.com/add/tonProfil" target="_blank" rel="noopener noreferrer">
        <SiSnapchat className="social-icon" />
      </a>
      <a href="https://www.instagram.com/tonProfil" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="social-icon" />
      </a>
      <a href="https://www.tiktok.com/@tonProfil" target="_blank" rel="noopener noreferrer">
        <FaTiktok className="social-icon" /> {/* Icône TikTok */}
      </a>
    </div>
  );
};

export default SocialFollow;
