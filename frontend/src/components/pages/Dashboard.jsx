import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventCard from "../common/EventsCard";
import CreateEventModal from "../core/CreateEventModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const { token } = useSelector((store) => store.auth);
  const [events, setEvents] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginPromptModalOpen, setIsLoginPromptModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(BACKEND_URL + "events");
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Filter logic
    const filtered = events.filter((event) => {
      const matchesCategory = updatedFilters.category
        ? event.category.toLowerCase() === updatedFilters.category.toLowerCase()
        : true;

      const matchesStartDate = updatedFilters.startDate
        ? new Date(event.startDate) >= new Date(updatedFilters.startDate)
        : true;

      const matchesEndDate = updatedFilters.endDate
        ? new Date(event.endDate) <= new Date(updatedFilters.endDate)
        : true;

      return matchesCategory && matchesStartDate && matchesEndDate;
    });

    // Reset to all events if no filters are applied
    if (
      !updatedFilters.category &&
      !updatedFilters.startDate &&
      !updatedFilters.endDate
    ) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(filtered);
    }
  };

  const handleJoinEvent = (eventId) => {
    if (!token) {
      setIsLoginPromptModalOpen(true);
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const handleCreateEvent = () => {
    if (!token) {
      setIsLoginPromptModalOpen(true);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category Dropdown */}
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Tech">Tech</option>
          <option value="Art">Art</option>
        </select>

        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg"
        />

        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg"
        />

        {/* Create Event Button */}
        <button
          onClick={handleCreateEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents &&
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event?.title}
              description={event.description}
              createdBy={event?.createdBy?.fullName}
              category={event?.category?.toUpperCase()}
              startDate={event.startDate}
              endDate={event.endDate}
              imageUrl={event.imageUrl}
              onJoin={() => handleJoinEvent(event._id)}
            />
          ))}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={() => {
          setIsCreateModalOpen(false);
        }}
      />

      {/* Login Prompt Modal */}
      {isLoginPromptModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">
              You need to log in to access this feature. Please log in or
              register to continue.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsLoginPromptModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
