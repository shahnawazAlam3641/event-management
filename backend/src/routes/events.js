const express = require("express");
const Event = require("../models/Event.js");
const auth = require("../middlewares/auth.js");
const { z } = require("zod");
const cloudinary = require("cloudinary");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Create event
router.post("/", auth, async (req, res) => {
  try {
    const requestBodySchema = z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(8).max(200),
      startDate: z.string().min(10).max(10),
      endDate: z.string().min(10).max(10),
      category: z.string().min(3).max(50),
    });

    const isParsedDataSuccess = requestBodySchema.safeParse(req.body);
    if (!isParsedDataSuccess.success) {
      return res.status(400).json({
        success: false,
        message: isParsedDataSuccess.error.issues[0].message,
      });
    }

    const { title, description, startDate, endDate, category } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "event_images",
      public_id: `event_${Math.floor(Math.random() * 10000000)}`,
      resource_type: "auto",
    });

    const imageUrl = result.secure_url;

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      category,
      imageUrl,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the event",
    });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({})
      .populate("createdBy")
      .select("-password");
    res.json({ success: true, message: "Events Found", events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single event
router.get("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "fullName")
      .populate("attendees.user", "fullName");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const isUserAttendee = event.attendees.some(
      (attendee) => attendee?.user?._id.toString() === req.user.id
    );
    const isEventStarted = new Date(event.startDate) <= new Date();

    res.json({
      success: true,
      event,
      isUserAttendee,
      isEventStarted,
    });
  } catch (error) {
    console.error("Error fetching event:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update event
router.put("/:id", auth, async (req, res) => {
  try {
    const requestBodySchema = z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(8).max(200),
      startDate: z.string().min(5).max(100),
      endDate: z.string().min(5).max(100),
      category: z.string().min(5).max(100),
    });

    const isparsedDataSuccess = requestBodySchema.safeParse(req.body);

    if (!isparsedDataSuccess.success) {
      res.status(401).json({
        success: false,
        message: isparsedDataSuccess.error.issues[0].message,
        error: isparsedDataSuccess.error,
      });
      return;
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const { title, description, startDate, endDate, category } = req.body;

    //  startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    //  Check Uploaded File
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.image;

    // Check file type
    if (!file.mimetype.startsWith("image")) {
      return res
        .status(400)
        .json({ success: false, message: "Only image files are allowed" });
    }

    // Check file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }

    // Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "event_images",
      public_id: `event_${Math.floor(Math.random() * 10000000)}`, // Generate unique ID for the image
      resource_type: "auto",
    });

    const imageUrl = result.secure_url;

    Object.assign(event, {
      title,
      description,
      startDate,
      endDate,
      category,
      imageUrl,
    });
    await event.save();

    res.json({ success: true, message: "Event Updated Successfully", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error occured while updating event" });
  }
});

router.post("/:id/attend", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      console.error("Event not found");
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Check if the user is already an attendee
    const isAlreadyAttendee = event.attendees.some(
      (attendee) => attendee?.user?.toString() === userId
    );

    if (isAlreadyAttendee) {
      return res.json({
        success: true,
        message: "User already joined the event",
        event,
      });
    }

    // Add the user to the attendees list
    event.attendees.push({ user: userId });
    await event.save();

    return res.json({
      success: true,
      message: "User successfully joined the event",
      event,
    });
  } catch (error) {
    console.error("Error joining event:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
