import { useState, useEffect } from "react";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaUser,
  FaExclamationCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const FeedbackAndReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState("all"); // all, positive, negative
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/reviews?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Handle empty data case without error
          setReviews([]);
        } else {
          throw new Error("Failed to fetch reviews");
        }
      } else {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (error) {
      if (!error.message.includes("404")) {
        setError(error.message);
        toast.error("Error loading reviews");
      }
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      if (!editingReview?._id) {
        throw new Error("No review selected for editing");
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/reviews/${editingReview._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: newRating,
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      toast.success("Review updated successfully");
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/user/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.mentorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.sessionTopic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
        <p className="text-gray-700 text-xl">Error loading reviews</p>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Reviews & Feedback
        </h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Reviews</option>
            <option value="positive">Positive (4-5 ★)</option>
            <option value="negative">Negative (1-3 ★)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {review.mentorName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>

                <p className="text-gray-600 mb-4">{review.comment}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    Session: {review.sessionTopic}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setNewRating(review.rating);
                        setNewComment(review.comment);
                      }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaStar className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No reviews found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm
                ? "Try adjusting your search term"
                : filter === "all"
                ? "You haven't left any reviews yet"
                : `No ${filter} reviews found`}
            </p>
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
            <form onSubmit={handleEditReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-2xl ${
                        star <= newRating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackAndReviews;
