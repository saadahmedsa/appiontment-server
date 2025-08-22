import Appointment from "../models/appointment.js";
import { transporter } from "../../utils/mailer.js"

export const createAppointment = async (req, res) => {
  try {

    const { doctor, date, reason,name,userId, timeSlot ,email} = req.body;

    const appointment = await Appointment.create({
      patientId: userId,
      name,
      email,
      doctor,
      date,
      timeSlot,
      reason,
      status: "pending"
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getMyAppointments = async (req, res) => {
  try {
       const { id } = req.params;
const appointments = await Appointment.find({ patientId: id })
  .populate("doctor", "name speciality experience"); 
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getAllAppointments = async (req, res) => {
  try {
   
   const appointments = await Appointment.find()
  .populate("doctor", "name speciality experience"); 
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    // Update appointment
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("doctor", "name specialization"); // get doctor details too

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    // Now send email based on status
    const patientEmail = updated.email; 
    // 👆 You need to store patient email in appointment OR fetch from Clerk API

    if (!patientEmail) {
      return res.status(200).json({ 
        success: true, 
        data: updated, 
        warning: "No patient email found, so no email sent" 
      });
    }

    if (status === "approved") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: "Appointment Approved",
        html: `
          <h3>Your Appointment Has Been Approved ✅</h3>
          <p><b>Doctor:</b> ${updated.doctor?.name} (${updated.doctor?.specialization})</p>
          <p><b>Date:</b> ${new Date(updated.date).toLocaleString()}</p>
          <p>Reason: ${updated.reason}</p>
        `,
      });
    } else if (status === "rejected") {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: "Appointment Unavailable ❌",
        html: `
          <h3>Sorry, your appointment could not be scheduled</h3>
          <p><b>Doctor:</b> ${updated.doctor?.name} (${updated.doctor?.specialization})</p>
          <p><b>Date:</b> ${new Date(updated.date).toLocaleString()}</p>
          <p>Status: Slot unavailable</p>
        `,
      });
    }

    res.status(200).json({ success: true, data: updated, message: "Appointment updated & email sent" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const deleteAppointment = async (req, res) => {
  try {
   
    const { id } = req.params;
    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
