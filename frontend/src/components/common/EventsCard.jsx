import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({
  id,
  title,
  description,
  category,
  createdBy,
  startDate,
  endDate,
  imageUrl,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/event/${id}`)}
      className="max-w-md flex flex-col  mx-auto hover:scale-[99%] transition-all duration-200 bg-white shadow-lg rounded-lg overflow-hidden"
    >
      {/* Event Thumbnail */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full aspect-video h-48 object-cover"
      />

      <div className="flex flex-col gap-1   p-6">
        {/* Event Title */}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>

        {/* Event Description */}
        <p className="text-gray-600  line-clamp-3">{description}</p>

        {/* Event Category */}
        <p className="text-sm text-gray-500 ">
          <span className="font-semibold">Category:</span> {category}
        </p>

        {/* Event Dates */}
        <div className="">
          <p className="text-gray-700">
            <span className="font-semibold">Start Date:</span>{" "}
            {new Date(startDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">End Date:</span>{" "}
            {new Date(endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Event Creator */}
        <p className="text-gray-500 ">
          <span className="font-semibold">Created By:</span> {createdBy}
        </p>

        {/* Join Button */}
        <button className="py-1 px-2 border-2 text-white w-full border-[#E54065] bg-[#E54065]  hover:text-black rounded-md hover:bg-white transition-colors duration-200">
          Show Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
