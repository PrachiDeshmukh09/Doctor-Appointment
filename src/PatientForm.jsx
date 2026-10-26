export default function PatientForm({ patient, onChange, onSubmit, onBack }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <h2>Patient Details</h2>
      <p>Please enter patient information.</p>

      <div className="form-grid">
        <label>
          Full Name *
          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={onChange}
            placeholder="Enter full name"
            minLength="2"
            required
          />
        </label>

        <label>
          Age *
          <input
            type="number"
            name="age"
            value={patient.age}
            onChange={onChange}
            placeholder="Enter age"
            min="1"
            max="120"
            required
          />
        </label>

        <label>
          Gender *
          <select
            name="gender"
            value={patient.gender}
            onChange={onChange}
            required
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>

        <label>
          Phone Number *
          <input
            type="tel"
            name="phone"
            value={patient.phone}
            onChange={onChange}
            placeholder="Enter 10-digit number"
            pattern="[0-9]{10}"
            required
          />
        </label>

        <label className="form-full">
          Email Address *
          <input
            type="email"
            name="email"
            value={patient.email}
            onChange={onChange}
            placeholder="Enter email"
            required
          />
        </label>

        <label className="form-full">
          Reason for Visit *
          <textarea
            name="reason"
            value={patient.reason}
            onChange={onChange}
            placeholder="Enter reason for appointment"
            rows="3"
            minLength="3"
            required
          />
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button-outline"
          onClick={onBack}
        >
          Back
        </button>

        <button type="submit" className="button-primary">
          Review Appointment
        </button>
      </div>
    </form>
  );
}