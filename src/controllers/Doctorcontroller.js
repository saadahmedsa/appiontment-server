import "dotenv/config"
import mongoose from "mongoose";
import Doctor from "../models/doctor.js";
import { v2 as cloudinary} from "cloudinary"
 cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });
export const createDoctor = async (req, res) => {

    const { name , image , speciality , degree , experience , about , fees , address} = req.body

    if( !name ||  !image || !speciality || !degree || !experience || !about || !fees || !address){

      return      res.status(400).json({ success: false, message: "All feilds are required" });
    }

 let imageUrl = "";
      const uploadResult = await cloudinary.uploader.upload_stream(
        { folder: "doctors" }, // optional folder name
        (error, result) => {
          console.log(error);
          
          if (error) throw error;
          imageUrl = result.secure_url;
        }
      );
      if(uploadResult ){

      return      res.status(400).json({ success: false, message: "Image upload failed" });
    }

      // convert buffer to stream
      streamifier.createReadStream(req.file.buffer).pipe(uploadResult);
    
  try {
    const doctor = await Doctor.create({
       name , image:imageUrl , speciality , degree , experience , about , fees , address  
    });
    
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ success: false, message: error.message });
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
    const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid doctor ID" });
  }
  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
