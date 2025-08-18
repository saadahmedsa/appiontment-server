import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: false,
  },
  speciality: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  experience: {
    type: String, 
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  address: {
 
      type: String,
      required: true,
   
  },
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
