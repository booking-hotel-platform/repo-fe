import React from 'react';
import './authorCard.css'; // Import file CSS

const AuthorCard = ({user}) => {
    return (
        <div className="author-card">
            <div className="author-info">
                <img
                    className="author-avatar"
                    src="https://res.cloudinary.com/ds6fxaiqd/image/upload/v1745479172/avatar_lu5w24.png"
                    alt="Avatar"
                />
                <div className="author-details">
                    <h2 className="author-name">{user?.username}</h2>
                </div>
            </div>
        </div>
    );
};

export default AuthorCard;