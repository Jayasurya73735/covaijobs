const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for file uploads
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// API endpoint to handle form submission
app.post("/submit", upload.single("file"), async (req, res) => {
    try {
        const { firstName, lastName, email, companyName, description } = req.body;
        const file = req.file;

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Or use other mail services
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFY_EMAIL, // Notify email address
            subject: "New Contact Form Submission",
            html: `
                <h1>Contact Form Submission</h1>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${companyName || "N/A"}</p>
                <p><strong>Description:</strong> ${description}</p>
            `,
            attachments: file
                ? [
                      {
                          filename: file.originalname,
                          path: file.path,
                      },
                  ]
                : [],
        };

        await transporter.sendMail(mailOptions);

        // Delete the uploaded file after email is sent
        if (file) {
            fs.unlinkSync(file.path);
        }

        res.status(200).json({ message: "Form submitted successfully." });
    } catch (error) {
        console.error("Error processing form submission:", error);
        res.status(500).json({ message: "Failed to submit form." });
    }
});

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
