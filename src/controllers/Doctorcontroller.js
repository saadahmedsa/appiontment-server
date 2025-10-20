import "dotenv/config"
import mongoose from "mongoose";
import Doctor from "../models/doctor.js";
import { v2 as cloudinary} from "cloudinary"
import fs from "fs";
import path from "path";
 cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });



// Create doctor


export const createDoctor = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  try {
    const { name, speciality, degree, experience, about, fees, address } = req.body;

    if (!name || !speciality || !degree || !experience || !about || !fees || !address) {
      // Delete uploaded file if validation fails
      fs.unlink(path.join(process.cwd(), "uploads", req.file.filename), () => {});
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "doctors" });

    // Delete the file from local disk after upload
    fs.unlink(path.join(process.cwd(), "uploads", req.file.filename), (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Save doctor in DB
    const doctor = await Doctor.create({
      name,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      image: result.secure_url,
    });

    res.status(201).json({ success: true, doctor });
  } catch (error) {
    console.error(error);

    // Delete file on error
    if (req.file) {
      fs.unlink(path.join(process.cwd(), "uploads", req.file.filename), (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};



export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, data: doctors });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid doctor ID" });
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
    const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid doctor ID" });
  }
  try {
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const deleteDoctor = async (req, res) => {
  
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


  