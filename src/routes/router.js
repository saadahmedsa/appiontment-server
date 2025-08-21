import express from "express"
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "../controllers/Doctorcontroller.js"
import { createAppointment, deleteAppointment, getAllAppointments, getMyAppointments, updateAppointment } from "../controllers/Appointmentcontroller.js"


const router = express.Router()

// doctor api
router.post("/add", createDoctor)
router.get("/all", getDoctors)
router.get("/single/:id", getDoctorById)
router.delete("/delete/:id", deleteDoctor)
router.put("/edit/:id", updateDoctor)
// appointment api


router.post("/book", createAppointment);
router.get("/allappointment", getAllAppointments);
router.get("/my/:id", getMyAppointments);
router.put("update/:id", updateAppointment);
router.delete("delete/:id", deleteAppointment);

export default router