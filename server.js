import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ When someone goes to "/", serve page_02.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "page_02.html"));
});

// ✅ Email route
app.post("/send-email", async (req, res) => {
    const { name, email, phone, department } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: "malaikarizwan121@gmail.com",
        subject: "🎓 New Laptop Scheme Applicant",
        text: `
New applicant validated successfully!
------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Department: ${department}
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Email sending failed" });
    }
});

// ✅ Start server
app.listen(5000, () =>
    console.log("✅ Server running on http://localhost:5000")
);
