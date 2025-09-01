import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await sendEmail({
      email: process.env.EMAIL_USER, // your inbox
      subject: `New Contact Form Message: ${subject}`,
      message: `
        <h3>New Message from Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.json({ success: true, msg: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, msg: "Failed to send message" });
  }
});

export default router;