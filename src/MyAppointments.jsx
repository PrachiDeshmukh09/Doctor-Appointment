import { useState } from "react";
import { doctors, todayString } from "./data.js";
import { api } from "./api.js";

export default function MyAppointments({ appointments, onRefresh }) {
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  let filteredAppointments = appointments;

  if (filter === "Upcoming") {
    filteredAppointments = appointments.filter(
      (item) =>
        item.date >= todayString() &&
        item.status !== "Cancelled" &&
        item.status !== "Completed"
    );
  }

  if (filter === "Past") {
    filteredAppointments = appointments.filter(
      (item) =>
        item.date < todayString() ||
        item.status === "Cancelled" ||
        item.status === "Completed"
    );
  }

  // Cancel appointment
  function cancelAppointment(id) {
    const confirmCancel = window.confirm("Cancel this appointment?");

    if (confirmCancel) {
      api.updateAppointment(id, { status: "Cancelled" })
        .then(() => {
          setMessage("Appointment cancelled successfully.");
          onRefresh();
        })
        .catch(() => {
          setMessage("Failed to cancel appointment.");
        });
    }
  }

  function rescheduleAppointment(appointment) {
    const newDate = window.prompt("Enter new date (YYYY-MM-DD)");

    if (!newDate) return;

    if (newDate < todayString()) {
      setMessage("Please select today or a future date.");
      return;
    }

    const newTime = window.prompt("Enter new time (e.g. 10:00 AM)");

    if (!newTime) return;

    api.getAppointments()
      .then((allAppointments) => {
        const alreadyBooked = allAppointments.some(
          (item) =>
            String(item.doctorId) === String(appointment.doctorId) &&
            item.date === newDate &&
            item.time === newTime &&
            String(item.id) !== String(appointment.id) &&
            item.status !== "Cancelled" &&
            item.status !== "Completed"
        );

        if (alreadyBooked) {
          setMessage("This time slot is already booked.");
          return false;
        }

        return api.updateAppointment(appointment.id, {
          date: newDate,
          time: newTime,
          status: "Confirmed"
        });
      })
      .then((result) => {
        if (result) {
          setMessage("Appointment rescheduled successfully.");
          onRefresh();
        }
      })
      .catch(() => {
        setMessage("Failed to reschedule appointment.");
      });
  }

  return (
    <section className="page-section">
      <h1>My Appointments</h1>
      <p>View and manage your appointments.</p>

      {message && <p className="form-error">{message}</p>}

      <div className="filters">
        {["All", "Upcoming", "Past"].map((item) => (
          <button
            key={item}
            className={filter === item ? "button-primary" : "button-outline"}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((appointment) => {
            const doctor = doctors.find(
              (item) => String(item.id) === String(appointment.doctorId)
            );

            return (
              <div className="appointment-card" key={appointment.id}>
                <h3>Dr. {appointment.doctorName || doctor?.name}</h3>

                <p>Patient: {appointment.patient?.name}</p>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Fee: ₹{appointment.fee ?? doctor?.fee}</p>
                <p>Status: {appointment.status}</p>
                <p>
                  Appointment ID: {appointment.appointmentId || appointment.id}
                </p>

                {appointment.status !== "Cancelled" &&
                  appointment.status !== "Completed" && (
                    <>
                      <button
                        className="button-outline"
                        onClick={() => rescheduleAppointment(appointment)}
                      >
                        Reschedule
                      </button>

                      <button
                        className="button-danger"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
