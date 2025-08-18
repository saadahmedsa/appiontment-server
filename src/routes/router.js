import express from "express"
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "../controllers/Doctorcontroller.js"


const router = express.Router()


router.post("/add", createDoctor)
router.get("/all", getDoctors)
router.get("/single/:id", getDoctorById)
router.delete("/delete/:id", deleteDoctor)
router.put("/edit/:id", updateDoctor)



export default router