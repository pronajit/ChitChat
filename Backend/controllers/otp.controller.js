const Otp = require("../models/otp.model");
const nodemailer = require("nodemailer");

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email }); // remove old OTPs

  await Otp.create({
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your ChitChat OTP Code",
    text: `Your OTP is ${otp}`,
  });

  res.status(200).json({ message: "OTP sent to email", success: true });
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (!record)
    return res.status(400).json({ message: "OTP not found", success: false });

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP", success: false });

  if (record.expiresAt < Date.now())
    return res.status(400).json({ message: "OTP expired", success: false });

  await Otp.deleteOne({ email });

  res.status(200).json({ message: "OTP verified", success: true });
};

module.exports = {sendOtp, verifyOtp};
