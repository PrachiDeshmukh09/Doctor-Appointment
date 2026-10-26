export const doctors = [
  {
    id: 1,
    name: "Priya Sharma",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: "10 years experience",
    fee: 800,
    qualifications: "MBBS, MD Cardiology",
    address: "City Care Hospital, Pune",
    days: "Monday, Tuesday, Wednesday, Friday",
    hours: "10:00 AM - 04:00 PM",
    bio: "Experienced cardiologist specializing in heart health."
  },
  {
    id: 2,
    name: "Rahul Verma",
    specialty: "Dermatologist",
    rating: 4.7,
    experience: "8 years experience",
    fee: 600,
    qualifications: "MBBS, MD Dermatology",
    address: "Health Plus Clinic, Pune",
    days: "Monday, Wednesday, Thursday, Saturday",
    hours: "11:00 AM - 05:00 PM",
    bio: "Specialist in skin and hair care."
  },
  {
    id: 3,
    name: "Anjali Patel",
    specialty: "Pediatrician",
    rating: 4.9,
    experience: "7 years experience",
    fee: 500,
    qualifications: "MBBS, MD Pediatrics",
    address: "Little Stars Clinic, Pune",
    days: "Tuesday, Wednesday, Friday, Saturday",
    hours: "09:00 AM - 02:00 PM",
    bio: "Provides healthcare and wellness support for children."
  }
];

export const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM"
];

export function todayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}