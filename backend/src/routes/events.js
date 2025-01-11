import express from "express";
import Event from "../models/Event.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Create event
router.post("/", auth, async (req, res) => {
  try {
    const requestBodySchema = z.object({
      title: z.string().email().min(5).max(100),
      description: z.string().min(8).max(200),
      location: z.string().min(3).max(50),
      startDate: z.string().min(5).max(100),
      endDate: z.string().min(5).max(100),
      category: z.string().min(5).max(100),
      imageUrl: z.string(),
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

    const {
      title,
      description,
      location,
      startDate,
      endDate,
      category,
      imageUrl,
    } = req.body;

    const event = new Event({
      title,
      description,
      location,
      startDate,
      endDate,
      category,
      imageUrl,
      createdBy: req.user.id,
    });

    await event.save();
    res
      .status(201)
      .json({ success: true, message: "Event created Successfully", event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all events with filters
router.get("/", async (req, res) => {
  try {
    const requestBodySchema = z.object({
      location: z.string().min(3).max(50),
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

    const { category, startDate, endDate, location } = req.query;
    const query = {};

    if (location) {
      query.location = location;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const events = await Event.find(query)
      .populate("createdBy", "username fullName")
      .populate("attendees.user", "username fullName")
      .sort({ startDate: 1 });

    res.json({ success: true, message: "Events Found", events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "username fullName")
      .populate("attendees.user", "username fullName");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update event
router.put("/:id", auth, async (req, res) => {
  try {
    const requestBodySchema = z.object({
      title: z.string().email().min(5).max(100),
      description: z.string().min(8).max(200),
      location: z.string().min(3).max(50),
      startDate: z.string().min(5).max(100),
      endDate: z.string().min(5).max(100),
      category: z.string().min(5).max(100),
      imageUrl: z.string(),
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

    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ success: true, message: "Event Updated Successfully", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error occured while updating event" });
  }
});

// Delete event
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.use.id,
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update attendance status
router.post("/:id/attend", auth, async (req, res) => {
  try {
    const requestBodySchema = z.object({
      status: z.string().email().min(3).max(100),
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

    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const attendeeIndex = event.attendees.findIndex(
      (a) => a.user.toString() === req.userId
    );

    if (attendeeIndex > -1) {
      event.attendees[attendeeIndex].status = status;
    } else {
      event.attendees.push({
        user: req.user.id,
        status,
      });
    }

    await event.save();
    return res.json({ success: true, message: "Status Updated", event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
