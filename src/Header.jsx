import { Link, NavLink } from "react-router-dom";
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand"><span>+</span> CarePoint</Link>
        <nav className="navigation">
          <NavLink to="/" end> Doctors </NavLink>
          <NavLink to="/book"> Book Appointment</NavLink>
          <NavLink to="/appointments">My Appointments</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}