
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api.js";

import DoctorCard from "./DoctorCard.jsx";
import DoctorProfile from "./DoctorProfile.jsx";
import AppointmentBooking from "./AppointmentBooking.jsx";
import MyAppointments from "./MyAppointments.jsx";
import AdminPanel from "./AdminPanel.jsx";
import "./App.css";

function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors", search, specialty],
    queryFn: () => api.getDoctors(search, specialty),
  });

  return (
    <section className="page-section">
      <h1>Find a Doctor</h1>

      <input
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option>All</option>
        <option>Cardiologist</option>
        <option>Dermatologist</option>
        <option>Pediatrician</option>
      </select>

      {isLoading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onView={setSelectedDoctor}
            />
          ))}
        </div>
      )}

      {selectedDoctor && (
        <DoctorProfile
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </section>
  );
}

export default function App() {
  const { data: appointments = [], refetch: refreshAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: api.getAppointments,
  });

  const { data: blockedSlots = [], refetch: refreshSlots } = useQuery({
    queryKey: ["blockedSlots"],
    queryFn: api.getBlockedSlots,
  });

  function refreshData() {
    refreshAppointments();
    refreshSlots();
  }

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">+ CarePoint</Link>
        <nav className="main-nav">
          <Link to="/">Doctors</Link>
          <Link to="/appointments">My Appointments</Link>
          <Link to="/admin">Admin Panel</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<DoctorsPage />} />
        <Route
          path="/book"
          element={
            <AppointmentBooking
              appointments={appointments}
              blockedSlots={blockedSlots}
              onRefresh={refreshData}
            />
          }
        />
        <Route
          path="/appointments"
          element={
            <MyAppointments
              appointments={appointments}
              onRefresh={refreshData}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPanel
              appointments={appointments}
              blockedSlots={blockedSlots}
              onRefresh={refreshData}
            />
          }
        />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>

      <footer className="site-footer">
        <p>CarePoint © {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
