import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

function Report() {
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  const [currentReport, setCurrentReport] = useState([]);
  const [reportType, setReportType] = useState("daily");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/reports/weekly`)
      .then((response) => {
        setWeeklyReport(response.data);
        setCurrentReport(response.data);
      });
  }, []);

  const fetchDailyReport = () => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/reports/daily`)
      .then((response) => {
        setDailyReport(response.data);
        setCurrentReport(response.data);
        setReportType("daily");
      });
  };

  const fetchWeeklyReport = () => {
    setCurrentReport(weeklyReport);
    setReportType("weekly");
  };

  const exportToExcel = () => {
    const flattenData = currentReport.flatMap((item) => {
      if (item.demographics.length === 0) {
        return [
          {
            Doctor: item.doctor,
            TotalRevenue: item.total,
            PatientsServed: item.patientsServed,
            PatientName: "No demographics data",
            Age: "",
            Revenue: "",
            Date: "",
          },
        ];
      } else {
        return item.demographics.map((d) => ({
          Doctor: item.doctor,
          TotalRevenue: item.total,
          PatientsServed: item.patientsServed,
          PatientName: d.name,
          Age: d.age,
          Revenue: d.revenue,
          Date: d.date,
        }));
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${reportType} Report`);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const currentDate = new Date().toISOString().split("T")[0];
    saveAs(blob, `${reportType}_report_${currentDate}.xlsx`);
  };

  return (
    <div className="container my-4">
      <Link to="/" className="btn btn-dark mb-3 mx-3">
        Home
      </Link>
      <h2 className="text-center mb-4">
        REPORT of {new Date().toLocaleDateString()}
      </h2>
      <div className="mb-4 text-center">
        <button className="btn btn-primary mx-2" onClick={fetchWeeklyReport}>
          Fetch Weekly Report
        </button>
        <button className="btn btn-primary mx-2" onClick={fetchDailyReport}>
          Fetch Daily Report
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-responsive table-bordered text-center">
          <thead className="thead-dark table-light">
            <tr>
              <th rowSpan="2" className="align-middle">
                Doctor
              </th>
              <th rowSpan="2" className="align-middle">
                Total Revenue
              </th>
              <th rowSpan="2" className="align-middle">
                Patients Served
              </th>
              <th colSpan="4">Demographics</th>
            </tr>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Revenue</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="table-striped">
            {currentReport.map((e, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td
                    rowSpan={e.demographics.length + 1}
                    className="align-middle"
                  >
                    {e.doctor}
                  </td>
                  <td
                    rowSpan={e.demographics.length + 1}
                    className="align-middle"
                  >
                    {e.total}
                  </td>
                  <td
                    rowSpan={e.demographics.length + 1}
                    className="align-middle"
                  >
                    {e.patientsServed}
                  </td>
                </tr>
                {e.demographics.length > 0 ? (
                  e.demographics.map((d, idx) => (
                    <tr className="table-striped" key={idx}>
                      <td>{d.name}</td>
                      <td>{d.age}</td>
                      <td>{d.revenue}</td>
                      <td>{d.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary mt-4" onClick={exportToExcel}>
        Export to Excel
      </button>
    </div>
  );
}

export default Report;
