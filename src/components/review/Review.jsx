import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './review.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ReviewSection = ({reviews, setReviews}) => {
  const location = useLocation();
  const hotelId = location?.pathname?.split('/')[2];
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    comment: '',
    rating: 0,
    tempRating: 0 
  });

  const handleRating = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating,
      tempRating: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/reviews?hotelId=${hotelId}`, newReview, {
        withCredentials: true
      });
      setReviews(prev => [res.data, ...prev]);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    setNewReview({ comment: '', rating: 0, tempRating: 0 });
    setShowForm(false);
  };

  // Render sao đánh giá cho review mới
  const renderNewReviewStars = () => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`rating-star ${
          index < (newReview.tempRating || newReview.rating) 
            ? 'filled' 
            : 'empty'
        }`}
        onMouseEnter={() => setNewReview(prev => ({...prev, tempRating: index + 1}))}
        onMouseLeave={() => setNewReview(prev => ({...prev, tempRating: prev.rating}))}
        onClick={() => handleRating(index + 1)}
      />
    ));
  };

  // Render sao đánh giá cho review đã có
  const renderReviewStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`rating-star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  return (
    <div className="review-section">
      {/* Header */}
      <div className="review-header">
        <h2 className="review-title">
          Reviews ({reviews.length} reviews)
        </h2>
        <button 
          className="review-main-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close Your Review' : 'Share Your Thoughts'}
        </button>
      </div>

      {/* Form tạo review */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3 className="form-title">Your Review</h3>
          
          <div className="rating-select">
            {renderNewReviewStars()}
            <span className="rating-text">
              ({newReview.rating} star)
            </span>
          </div>

          <textarea
            className="review-textarea"
            placeholder="Input your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({
              ...prev,
              comment: e.target.value
            }))}
          />

          <button 
            type="submit"
            className="submit-button"
            disabled={!newReview.rating || !newReview.comment}
          >
            Send Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div>
        {reviews.slice(0, visibleReviews).map((review) => (
          <div 
            key={review?.reviewId}
            className="review-item"
          >
            <div className="review-user-info">
              <div>
                <h3 className="review-username">{review?.userResponse?.username}</h3>
                <p className="review-date">
                  {review?.createAt}
                </p>
              </div>
              <div className="review-stars">
                {renderReviewStars(review.rating)}
              </div>
            </div>
            <p className="review-content">
              {review?.comment}
            </p>
          </div>
        ))}
      </div>

      {/* View More */}
      {visibleReviews < reviews.length && (
        <div className="review-view-more">
          <button
            onClick={() => setVisibleReviews(prev => prev + 5)}
            className="review-view-btn"
          >
            View more {Math.min(5, reviews.length - visibleReviews)} reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
