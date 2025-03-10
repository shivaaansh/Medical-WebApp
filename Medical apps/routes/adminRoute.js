const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");

// GET all doctors
router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors, // Ensure this is doctors, not user
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching doctor list",
      success: false,
      error,
    });
  }
});

// GET all users
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users, // Ensure this is users, not user
    });
  } catch (error) {
    res.status(500).send({
      message: "Error fetching user list",
      success: false,
      error,
    });
  }
});
router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status, userId } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;

      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `${doctor.firstName} ${doctor.lastName} your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      user.isDoctor = status === "approved" ? true : false;
      await User.save();

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating Doctor status",
        success: false,
        error,
      });
    }
  }
);

module.exports = router;
