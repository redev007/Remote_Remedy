import React, { useState } from 'react';
import useDocTitle from '../hooks/useDocTitle';
import Rating from 'react-rating-stars-component';

const Feedback = () => {
  useDocTitle('Feedback - Remote_Remedy');
  const [formData, setFormData] = useState({
    type: '',
    rating: 0,
    comments: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('type', formData.type);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('comments', formData.comments);

    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({ type: '', rating: 0, comments: '' });
      setIsModalOpen(true);
    }, 1000);
  };

  const ratingChanged = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 ">Share Your Feedback</h1>
            <h2 className="text-lg md:text-xl mb-6 text-gray-600">Your feedback matters to us, Help us improve our services!</h2>
            <img 
              src="https://i.pinimg.com/474x/95/6f/29/956f29bdd6ece3f6e2f7f476f65ef994.jpg" 
              alt="Feedback" 
              className="w-full max-w-md rounded-xl shadow-lg mx-auto"
            />
          </div>
          
          <div className="order-1 md:order-2">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
              <div className="mb-6">
                <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">Type of Feedback</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Services">Services</option>
                  <option value="Models">Models</option>
                  <option value="Products">Products</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="rating" className="block text-gray-700 font-semibold mb-2">Rating</label>
                <Rating
                  count={5}
                  value={formData.rating}
                  onChange={ratingChanged}
                  size={32}
                  activeColor="#FFBF00"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="comments" className="block text-gray-700 font-semibold mb-2">Comments</label>
                <textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows="4"
                  required
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your thoughts..."
                />
              </div>

              <button 
                    type="submit" 
                    className="w-full bg-[rgb(123,116,215)] text-white font-bold py-3 px-6 rounded-lg hover:bg-[rgb(94, 88, 184)] transition-colors duration-300">
                    Submit Feedback
              </button>

              {submitStatus === 'error' && (
                <div className="mt-4 text-red-600">Failed to submit feedback. Please try again.</div>
              )}
            </form>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Thank You!</h2>
              <p className="mb-6 text-gray-600">Your feedback has been successfully submitted.</p>
              <button
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Feedback;
