import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreatePatients() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([
    { treatment: "", date: "", doctor: "", revenue: "" },
  ]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the list of doctors from the API
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/doctors`)
      .then((response) => setDoctors(response.data.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const handleMedicalHistoryChange = (index, field, value) => {
    const newMedicalHistory = [...medicalHistory];
    newMedicalHistory[index][field] = value;
    setMedicalHistory(newMedicalHistory);
  };

  const addMedicalHistoryEntry = () => {
    setMedicalHistory([
      ...medicalHistory,
      { treatment: "", date: "", doctor: "", revenue: "" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !age || !gender || !phone || !address) {
      setError("All fields are required");
      return;
    }

    const userData = {
      firstName,
      lastName,
      age,
      gender,
      phone,
      address,
      medicalHistory: medicalHistory.map((entry) => ({
        ...entry,
        date: entry.date ? new Date(entry.date) : undefined,
      })),
    };

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/api/patients`, userData)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setError("Failed to submit the form");
      });
  };

  return (
    <div className="container mt-5">
      <Link to="/" className="btn btn-dark mb-3 mx-3">
        Home
      </Link>
      <h2>Patient Registration</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                className="form-control"
                id="age"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                placeholder="Enter phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="m-2">Medical History</h2>

        {medicalHistory.map((entry, index) => (
          <div key={index} className="row border p-3 mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor={`treatment-${index}`}>Treatment</label>
                <input
                  type="text"
                  className="form-control"
                  id={`treatment-${index}`}
                  placeholder="Enter treatment"
                  value={entry.treatment}
                  onChange={(e) =>
                    handleMedicalHistoryChange(
                      index,
                      "treatment",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={`doctor-${index}`}>Doctor</label>
                <select
                  className="form-control"
                  id={`doctor-${index}`}
                  value={entry.doctor}
                  onChange={(e) =>
                    handleMedicalHistoryChange(index, "doctor", e.target.value)
                  }
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor.name.toLowerCase()}>
                      {doctor.name.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor={`date-${index}`}>Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id={`date-${index}`}
                  placeholder="Enter date"
                  value={entry.date}
                  onChange={(e) =>
                    handleMedicalHistoryChange(index, "date", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={`revenue-${index}`}>Revenue</label>
                <input
                  type="number"
                  className="form-control"
                  id={`revenue-${index}`}
                  placeholder="Enter revenue"
                  value={entry.revenue}
                  onChange={(e) =>
                    handleMedicalHistoryChange(index, "revenue", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary m-2"
          onClick={addMedicalHistoryEntry}
        >
          Add Medical History Entry
        </button>
        <button type="submit" className="btn btn-primary m-2">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePatients;
