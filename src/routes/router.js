import express from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from "../controllers/Doctorcontroller.js";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getMyAppointments,
  getTodayAppointments,
  updateAppointment,
} from "../controllers/Appointmentcontroller.js";
import { getUser } from "../controllers/Usercontroller.js";
import { requireAdmin, requireuser, upload } from "../middleware/index.js";


const router = express.Router();

// Users (Admin only)
router.get("/users",requireuser,requireAdmin,  getUser);

//  Doctors
router.post("/add", requireuser, requireAdmin, upload.single("image"), createDoctor);   
router.put("/edit/:id", requireuser, requireAdmin, updateDoctor);
router.delete("/delete/:id", requireuser, requireAdmin, deleteDoctor); 

router.get("/all", getDoctors);         // public
router.get("/single/:id", getDoctorById); // public

//  Appointments
router.post("/book", requireuser , createAppointment);
router.get("/my/:id", requireuser, getMyAppointments); 
router.get("/appointments/today", requireuser, requireAdmin,getTodayAppointments);
router.get("/allappointment", requireuser, requireAdmin, getAllAppointments); 
router.put("/update/:id", requireuser, requireAdmin, updateAppointment); 
router.delete("/delete/:id", requireuser, requireAdmin, deleteAppointment); 

export default router;
