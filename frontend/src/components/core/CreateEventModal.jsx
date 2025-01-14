import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateEventModal = ({ isOpen, onClose, onSubmit }) => {
  const { token } = useSelector((store) => store.auth);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: (Math.random() * 100000).toString(),
    description: (Math.random() * 100000).toString(),
    image: null,
    startDate: "",
    endDate: "",
    category: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        BACKEND_URL + "events/",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //   console.log(formData);

      console.log(response);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message);
    }
    // if (onSubmit) {
    //   onSubmit(formData);
    // }
    // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white relative rounded-lg shadow-lg p-6 w-full max-w-md">
        <span
          onClick={() => {
            onClose();
          }}
          className="absolute top-0 right-0 p-4 cursor-pointer font-bold"
        >
          X
        </span>
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter event description"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block font-medium mb-1">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              className="w-full border rounded-lg p-2"
              accept="image/*"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Art">Art</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Event
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
