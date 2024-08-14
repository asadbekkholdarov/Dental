import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function MedicalHistory() {
  const navigate = useNavigate();
  const params = useParams();
  const patientId = params.patientId;
  const [medicalHistory, setMedicalHistory] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    treatment: "",
    doctor: "",
    revenue: "",
    date: "",
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/patients/${patientId}`)
      .then((response) => {
        setMedicalHistory(response.data.patient);
      })
      .catch((error) => {
        console.error("There was an error fetching the patient data!", error);
      });

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/doctors`)
      .then((response) => {
        setDoctors(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the doctors data!", error);
      });
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMedicalHistory = [
      ...(medicalHistory.medicalHistory || []),
      newEntry,
    ];
    axios
      .put(`${import.meta.env.VITE_BASE_URL}/patients/${patientId}`, {
        ...medicalHistory,
        medicalHistory: updatedMedicalHistory,
      })
      .then((response) => {
        setMedicalHistory(response.data.patient);
        setNewEntry({
          treatment: "",
          doctor: "",
          revenue: "",
          date: "",
        });
        setShowForm(false);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "There was an error updating the medical history!",
          error
        );
      });
  };

  return (
    <div>
      <h2>Medical History</h2>
      <table className="table table-responsive table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{medicalHistory.firstName}</td>
            <td>{medicalHistory.lastName}</td>
            <td>{medicalHistory.age}</td>
            <td>{medicalHistory.phone}</td>
            <td>{medicalHistory.address}</td>
            <td>{medicalHistory.gender}</td>
          </tr>
        </tbody>
      </table>
      <table className="table table-responsive">
        <thead>
          <tr>
            <th>Treatment</th>
            <th>Doctor</th>
            <th>Revenue</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {medicalHistory.medicalHistory &&
          medicalHistory.medicalHistory.length > 0 ? (
            medicalHistory.medicalHistory.map((e, i) => (
              <tr key={i}>
                <td>{e.treatment || "-"}</td>
                <td>{e.doctor || "-"}</td>
                <td>{e.revenue || 0}</td>
                <td>{e.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No medical history found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="btn btn-success"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add New History"}
      </button>
      {showForm && (
        <div className="d-flex justify-content-center mt-3">
          <form className="form-group col-md-4" onSubmit={handleSubmit}>
            <div>
              <label>Treatment:</label>
              <input
                className="form-control"
                type="text"
                name="treatment"
                value={newEntry.treatment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Doctor:</label>
              <select
                className="form-control"
                name="doctor"
                value={newEntry.doctor}
                onChange={handleInputChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Revenue:</label>
              <input
                className="form-control"
                type="text"
                name="revenue"
                value={newEntry.revenue}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Date:</label>
              <input
                className="form-control"
                type="datetime-local"
                name="date"
                value={newEntry.date}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add Entry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;
