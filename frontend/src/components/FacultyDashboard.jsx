import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from 'xlsx'; // Import the xlsx library to parse and write Excel files
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const [excelData, setExcelData] = useState([]); // State to store Excel data
  const [attendanceStatus, setAttendanceStatus] = useState({}); // Store attendance status for each student
  const [todayDate, setTodayDate] = useState(new Date().toLocaleDateString()); // Get today's date
  const [uploadedFile, setUploadedFile] = useState(null); // Store the uploaded file
  const [email, setEmail] = useState(''); // Store the logged-in user's email
  const [students, setStudents] = useState([]); // Store students data for assignments/practicals
  const [filteredStudents, setFilteredStudents] = useState([]); // Store filtered students for search
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    enrollmentNumber: '',
    branch: '',
    assignmentStatus: '', // Removed practicalStatus
  });
  const navigate = useNavigate();

  // Retrieve email from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      loadStudentData(storedEmail); // Load student data associated with the email
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load student data from localStorage
  const loadStudentData = (email) => {
    const storedStudents = JSON.parse(localStorage.getItem(`students_${email}`)) || [];
    setStudents(storedStudents);
    setFilteredStudents(storedStudents); // Initialize filtered students with all data
  };

  // Handle logout functionality
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  // Handle Excel file upload for attendance
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file); // Store the uploaded file in the state

      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(data); // Set the parsed data to the state

        // Initialize the attendance status for each student
        const statuses = data.slice(1).reduce((acc, row, index) => {
          acc[index] = {
            attendance: '', // Initial empty attendance status
          };
          return acc;
        }, {});
        setAttendanceStatus(statuses);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Handle change in attendance status for each student
  const handleAttendanceChange = (index, value) => {
    const updatedStatus = { ...attendanceStatus };
    updatedStatus[index].attendance = value;
    setAttendanceStatus(updatedStatus);
  };

  // Update the existing Excel file with the updated attendance status and current date
  const updateExcelData = () => {
    const updatedData = excelData.map((row, index) => {
      if (index === 0) return [...row, `Attendance (${todayDate})`]; // Add 'Attendance (Today)' column in the header
      return [
        ...row,
        attendanceStatus[index - 1]?.attendance || '', // Default to empty attendance if not set
      ];
    });

    return updatedData;
  };

  // Update and export the file with the new attendance data
  const updateFileAndExport = () => {
    const updatedData = updateExcelData(); // Get the updated data
    const ws = XLSX.utils.aoa_to_sheet(updatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Export the updated data to the same file (the name will be the same, but the contents will be updated)
    const fileName = uploadedFile.name;
    XLSX.writeFile(wb, fileName); // Save it with the original file name
  };

  // Update date at midnight for the next day (you can customize this as needed)
  const updateDate = () => {
    setTodayDate(new Date().toLocaleDateString());
  };

  // Simulating daily date update
  useEffect(() => {
    const timer = setInterval(updateDate, 86400000); // Update every 24 hours (24 * 60 * 60 * 1000 ms)
    return () => clearInterval(timer); // Clear the interval when the component unmounts
  }, []);

  // Handle student data submission for assignment or practical
  const handleStudentSubmit = () => {
    // Add new student with status details to students list
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents); // Update filtered students as well
    localStorage.setItem(`students_${email}`, JSON.stringify(updatedStudents)); // Save data in localStorage
    setNewStudent({
      fullName: '',
      enrollmentNumber: '',
      branch: '',
      assignmentStatus: '', // Reset input fields
    });
  };

  // Handle student removal
  const handleStudentRemove = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents); // Update filtered students after removal
    localStorage.setItem(`students_${email}`, JSON.stringify(updatedStudents)); // Update data in localStorage
  };

  // Search student by full name or enrollment number
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const result = students.filter(student =>
      student.fullName.toLowerCase().includes(query) ||
      student.enrollmentNumber.toLowerCase().includes(query)
    );
    setFilteredStudents(result); // Update filtered students list
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Faculty Dashboard</h1>
      <p className="text-center">Welcome to the Faculty Dashboard, {email}!</p>

      {/* Logout Button */}
      <div className="text-end">
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </div>

      {/* Excel File Upload for Attendance Tracking */}
      <div className="col-12 mt-4">
        <h2>Upload Excel File for Attendance</h2>
        <input
          type="file"
          className="form-control"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
        />
      </div>

      {/* Display Excel Data with Editable Attendance Status */}
      {excelData.length > 0 && (
        <div className="col-12 mt-4">
          <h3>Attendance Data</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                {excelData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>{`Attendance (${todayDate})`}</th> {/* Display today's date in the header of the attendance column */}
              </tr>
            </thead>
            <tbody>
              {excelData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <select
                      value={attendanceStatus[rowIndex]?.attendance || ''}
                      onChange={(e) =>
                        handleAttendanceChange(rowIndex, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Button to Update and Export Updated Data to the Same Excel File */}
          <button onClick={updateFileAndExport} className="btn btn-primary mt-4">
            Update and Export Data to Excel
          </button>
        </div>
      )}

      {/* Assignment / Practical Section */}
      <div className="col-12 mt-4">
        <h2>Assign Assignment or Practical</h2>

        {/* Full Name Input */}
        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-2"
          value={newStudent.fullName}
          onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
        />

        {/* Enrollment Number Input */}
        <input
          type="text"
          placeholder="Enrollment Number"
          className="form-control mb-2"
          value={newStudent.enrollmentNumber}
          onChange={(e) => setNewStudent({ ...newStudent, enrollmentNumber: e.target.value })}
        />

        {/* Branch Input */}
        <input
          type="text"
          placeholder="Branch"
          className="form-control mb-2"
          value={newStudent.branch}
          onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
        />

        {/* Assignment/Practical Selection */}
        <select
          className="form-control mb-2"
          value={newStudent.assignmentStatus}
          onChange={(e) => setNewStudent({ ...newStudent, assignmentStatus: e.target.value })}
        >
          <option value="">Select Assignment or Practical</option>
          <option value="Assignment">Assignment</option>
          <option value="Practical">Practical</option>
          <option value="Both">Both</option>
        </select>

        {/* Submit Button */}
        <button className="btn btn-success" onClick={handleStudentSubmit}>Add Student</button>
      </div>

      {/* Search Section */}
      <div className="col-12 mt-4">
        <h3>Search Student</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search by Full Name or Enrollment Number"
          onChange={handleSearch}
        />
      </div>

      {/* Display Students Data */}
      {filteredStudents.length > 0 && (
        <div className="col-12 mt-4">
          <h3>Student List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Enrollment Number</th>
                <th>Branch</th>
                <th>Assignment And Practical Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.fullName}</td>
                  <td>{student.enrollmentNumber}</td>
                  <td>{student.branch}</td>
                  <td>{student.assignmentStatus}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStudentRemove(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Export Button */}
          <button onClick={updateFileAndExport} className="btn btn-primary mt-4">
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
