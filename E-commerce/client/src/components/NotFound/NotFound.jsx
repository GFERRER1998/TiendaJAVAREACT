import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-card">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Oops! Page not found</h2>
                <p className="notfound-text">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/dashboard" className="notfound-btn">
                    Go to homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
