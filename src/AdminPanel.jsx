import { useState } from "react";
import { doctors, timeSlots, todayString } from "./data.js";
import { api } from "./api.js";

export default function AdminPanel({ appointments, blockedSlots, onRefresh }) {
  const [date, setDate] = useState(todayString());
  const [doctorId, setDoctorId] = useState("");
  const [blockDate, setBlockDate] = useState(todayString());
  const [time, setTime] = useState("All day");
  const [message, setMessage] = useState("");

  function updateStatus(id, status) {
    api.updateAppointment(id, { status })
      .then(() => {
        onRefresh();
        setMessage("Appointment updated successfully!");
      })
      .catch(() => {
        setMessage("Something went wrong!");
      });
  }

  function blockSlot(event) {
    event.preventDefault();
    if (doctorId === "") {
      setMessage("Please select a doctor.");
      return;
    }

    const newSlot = {
      doctorId: Number(doctorId),
      date: blockDate,
      allDay: time === "All day",
      time: time === "All day" ? null : time
    };

    api.createBlockedSlot(newSlot)
      .then(() => {
        onRefresh();
        setMessage("Availability blocked successfully!");
      })
      .catch(() => {
        setMessage("Could not block availability.");
      });
  }

  function unblockSlot(id) {
    api.deleteBlockedSlot(id)
      .then(() => {
        onRefresh();
        setMessage("Slot unblocked successfully!");
      })
      .catch(() => {
        setMessage("Could not unblock slot.");
      });
  }

  return (
    <section className="page-section">
      <h1>Admin Panel</h1>
      <p>Manage appointments and doctor availability.</p>

      {message && <p>{message}</p>}

      <h2>Appointments</h2>
      <p>Total Appointments: {appointments.length}</p>

      <label>Select Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {appointments.filter((item) => item.date === date).length === 0 ? (
        <p>No appointments on this date.</p>
      ) : (
        appointments
          .filter((item) => item.date === date)
          .map((item) => (
            <div className="appointment-card" key={item.id}>
              <h3>Dr. {item.doctorName}</h3>
              <p>Patient: {item.patient?.name}</p>
              <p>Time: {item.time}</p>
              <p>Status: {item.status}</p>

              {item.status !== "Cancelled" &&
                item.status !== "Completed" && (
                  <>
                    <button
                      onClick={() => updateStatus(item.id, "Completed")}
                    >
                      Mark Completed
                    </button>

                    <button
                      onClick={() => updateStatus(item.id, "Cancelled")}
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
            </div>
          ))
      )}

      <hr />

      <h2>Block Doctor Availability</h2>

      <form onSubmit={blockSlot}>
        <label>Select Doctor</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Choose Doctor</option>

          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.name}
            </option>
          ))}
        </select>

        <label>Select Date</label>
        <input
          type="date"
          min={todayString()}
          value={blockDate}
          onChange={(e) => setBlockDate(e.target.value)}
          required
        />

        <label>Select Time</label>
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="All day">Entire Day</option>

          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <button type="submit">Block Availability</button>
      </form>

      <hr />

      <h2>Blocked Slots</h2>

      {blockedSlots.length === 0 ? (
        <p>No slots are blocked.</p>
      ) : (
        blockedSlots.map((slot) => {
          const doctor = doctors.find(
            (item) => item.id === Number(slot.doctorId)
          );

          return (
            <div className="appointment-card" key={slot.id}>
              <p>Doctor: {doctor ? doctor.name : "Unknown"}</p>
              <p>Date: {slot.date}</p>
              <p>Time: {slot.allDay ? "Entire Day" : slot.time}</p>

              <button onClick={() => unblockSlot(slot.id)}>
                Unblock
              </button>
            </div>
          );
        })
      )}
    </section>
  );
}