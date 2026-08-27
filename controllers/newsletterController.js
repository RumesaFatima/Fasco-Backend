import Newsletter from "../models/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "Email is already subscribed",
      });
    }

    const subscriber = await Newsletter.create({ email });

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      subscriber,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already subscribed",
      });
    }

    console.error("Newsletter subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to subscribe to newsletter",
    });
  }
};

export const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      subscribers,
    });
  } catch (error) {
    console.error("Get newsletter subscribers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch newsletter subscribers",
    });
  }
};