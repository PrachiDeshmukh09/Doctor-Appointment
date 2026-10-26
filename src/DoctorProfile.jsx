import { Link } from "react-router-dom";
export default function DoctorProfile({ doctor, onClose }) {
  if (!doctor) {
    return null;
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal"
        onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="profile-avatar">
          {doctor.name.split(" ").map((word) => word[0]).join("")}
        </div>
        <h2>{doctor.name}</h2>
        <p>{doctor.specialty}</p>
        <p>⭐ {doctor.rating} · {doctor.experience}</p>
        <div className="profile-details">
          <div>
            <strong>Qualifications</strong>
            <p>{doctor.qualifications}</p>
          </div>
          <div>
            <strong>Clinic Address</strong>
            <p>{doctor.address}</p>
          </div>
          <div>
            <strong>Consultation Fee</strong>
            <p>₹{doctor.fee}</p>
          </div>
          <div>
            <strong>Working Days</strong>
            <p>{doctor.days}</p>
          </div>
          <div>
            <strong>Working Hours</strong>
            <p>{doctor.hours}</p>
          </div>
          <div>
            <strong>About Doctor</strong>
            <p>{doctor.bio}</p>
          </div>
        </div>

        <Link to="/book"state={{ doctorId: doctor.id }}className="button-primary full-button"onClick={onClose}> Book Appointment</Link>
      </div>
    </div>
  );
}