import { useState } from "react";
import { useLocation } from "react-router-dom";
import { doctors, timeSlots, todayString } from "./data.js";
import { api } from "./api.js";
import PatientForm from "./PatientForm.jsx";

export default function AppointmentBooking({ appointments, blockedSlots, onRefresh }) {
  const location = useLocation();
  const [doctorId, setDoctorId] = useState(String(location.state?.doctorId || ""));
  const [date, setDate] = useState(todayString());
  const [time, setTime] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(null);

  const [patient, setPatient] = useState({
    name: "", age: "", gender: "", phone: "", email: "", reason: ""
  });
  const doctor = doctors.find((d) => String(d.id) === doctorId);
  function changePatient(e) {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  }

  function nextStep() {
    if (!doctor || !date || !time) {
      setMessage("Please select doctor, date and time.");
      return;
    }
    if (date < todayString()) {
      setMessage("Please select a valid date.");
      return;
    }
    for (let a of appointments) {
      if (String(a.doctorId) === doctorId && a.date === date &&
        a.time === time && a.status === "Confirmed") {
        setMessage("This slot is already booked.");
        return;
      }
    }
    for (let s of blockedSlots) {
      if (String(s.doctorId) === doctorId && s.date === date &&
        (s.allDay || s.time === time)) {
        setMessage("This slot is not available.");
        return;
      }
    }
    setMessage("");
    setStep(2);
  }

  async function bookAppointment() {
    try {
      const appointment = {
        appointmentId: "CP-" + Date.now(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        fee: doctor.fee,
        patient,
        date,
        time,
        status: "Confirmed"
      };
      const result = await api.createAppointment(appointment);
      setSaved(result);
      await onRefresh();
      setStep(3);
    } catch {
      setMessage("Booking failed. Please check the server.");
    }
  }
  if (step === 3) {
    return (
      <section className="page-section confirmation-card">
        <h1>Appointment Confirmed!</h1>
        <p>Appointment ID: {saved?.appointmentId}</p>
        <p>Doctor: {saved?.doctorName}</p>
        <p>Patient: {saved?.patient.name}</p>
        <p>Date: {saved?.date}</p>
        <p>Time: {saved?.time}</p>
        <p>Fee: ₹{saved?.fee}</p>
      </section>
    );
  }
  return (
    <section className="page-section">
      <h1>Book Appointment</h1>
      {message && <p className="form-error">{message}</p>}
      {step === 1 && (
        <div className="booking-card">
          <label>Select Doctor</label>
          <select value={doctorId} onChange={(e) => {
            setDoctorId(e.target.value);
            setTime("");
          }}>
            <option value="">Choose Doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>Dr. {d.name}</option>
            ))}
          </select>

          <label>Select Date</label>
          <input type="date" min={todayString()} value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }} />
          <h3>Select Time</h3>
          {timeSlots.map((slot) => (
            <button type="button" key={slot}
              disabled={!doctor}
              className={time === slot ? "time-slot selected" : "time-slot"}
              onClick={() => setTime(slot)}>
              {slot}
            </button>
          ))}
          <button className="button-primary" onClick={nextStep}>
            Continue
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="booking-card">
          <h3>Appointment Summary</h3>
          <p>Doctor: Dr. {doctor?.name}</p>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
          <p>Fee: ₹{doctor?.fee}</p>
          <PatientForm
            patient={patient}
            onChange={changePatient}
            onBack={() => setStep(1)}
            onSubmit={bookAppointment}
          />
        </div>
      )}
    </section>
  );
}
