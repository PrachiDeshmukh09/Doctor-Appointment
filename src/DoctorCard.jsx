import { Link } from "react-router-dom";
export default function DoctorCard({ doctor, onView }) {
  const initials = doctor.name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return (
    <div className="doctor-card">
      <div className="doctor-card-top">
        <div className="doctor-avatar">{initials}</div>
        <span className="rating">★ {doctor.rating}</span>
      </div>
      <h3>{doctor.name}</h3>
      <p>{doctor.specialty}</p>
      <p>{doctor.experience}</p>
      <div className="doctor-card-bottom">
        <div>
          <strong>₹{doctor.fee}</strong>
          <small> / visit</small>
        </div>

        <button className="button-outline"onClick={() => onView(doctor)}>View Profile</button>
      </div>
      <Link to="/book"state={{ doctorId: doctor.id }}className="button-primary full-button"> Book Appointment </Link>
    </div>
  );
}