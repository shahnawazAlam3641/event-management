import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditEventModal = ({ isOpen, onClose, eventDetails, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: eventDetails.title || "",
    description: eventDetails.description || "",
    startDate: eventDetails.startDate || "",
    endDate: eventDetails.endDate || "",
    category: eventDetails.category || "",
    image: null,
  });

  const { token } = useSelector((store) => store.auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const updatedData = new FormData();
      updatedData.append("title", formData.title);
      updatedData.append("description", formData.description);
      updatedData.append("startDate", formData.startDate);
      updatedData.append("endDate", formData.endDate);
      updatedData.append("category", formData.category);

      if (formData.image) {
        updatedData.append("image", formData.image);
      }

      const response = await axios.put(
        `${BACKEND_URL}events/${eventDetails._id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onUpdate(response.data.event); // Update the event details in the parent component
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="border p-2 rounded-lg"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="border p-2 rounded-lg"
            rows="4"
            required
          ></textarea>

          {/* Start Date */}
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />

          {/* End Date */}
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          >
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Tech">Tech</option>
            <option value="Art">Art</option>
          </select>

          {/* Image */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded-lg"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
