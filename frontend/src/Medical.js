import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/medical.css';

const Medical = () => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const initialRow = { year: '', incident: '', treatment: '', userid: auth.userId };
  const [medicalHistory, setMedicalHistory] = useState([initialRow]);
  const [viewHistory, setViewHistory] = useState(false);
  const [fullHistory, setFullHistory] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [operationCount, setOperationCount] = useState(0);

  useEffect(() => {
    fetchOperationCount();
    fetchFullHistory();
  }, []);

  const fetchOperationCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medical-history/count-operations');
      setOperationCount(response.data);
    } catch (error) {
      console.error('Error fetching operation count', error);
    }
  };

  const fetchFullHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medical-history?userid=${auth.userId}`);
      setFullHistory(response.data);
      setViewHistory(true);
    } catch (error) {
      console.error('Error fetching full medical history', error);
    }
  };

  const handleAddRow = () => {
    setMedicalHistory([...medicalHistory, { ...initialRow }]);
  };

  const handleChange = (index, field, value) => {
    const updatedHistory = medicalHistory.map((entry, idx) => {
      if (index === idx) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setMedicalHistory(updatedHistory);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const filledRows = medicalHistory.filter(row => row.year || row.incident || row.treatment);
    
    if (filledRows.length > 0) {
      try {
        await axios.post('http://localhost:5000/api/medical-history', filledRows);
        setMedicalHistory([initialRow]);
        fetchOperationCount(); // Refresh operation count after save
      } catch (error) {
        console.error('Error saving medical history', error);
      }
    } else {
      alert('Please fill in at least one row before saving.');
    }
  };

  const handleDelete = async () => {
    const rowsToDelete = selectedRows.map(index => ({
      userid: fullHistory[index][0],
      year: fullHistory[index][1],
      incident: fullHistory[index][2],
      treatment: fullHistory[index][3]
    }));

    try {
      await axios.post('http://localhost:5000/api/medical-history/delete', { rows: rowsToDelete });
      fetchFullHistory();
      fetchOperationCount(); // Refresh operation count after delete
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting medical history', error);
    }
  };

  const toggleRowSelection = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= 1900; year--) {
    yearOptions.push(<option key={year} value={year}>{year}</option>);
  }


  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>Medical History</h3>
          <h4>Total Operations Had Been Done: {operationCount}</h4>
        </div>
        <div className="card-body">
          {viewHistory ? (
            <div>
              <h4>Full Medical History</h4>
              <table className="table table-striped blue-table">
                <thead>
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col">Year</th>
                    <th scope="col">Incident</th>
                    <th scope="col">Treatment</th>
                  </tr>
                </thead>
                <tbody>
                  {fullHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                        />
                      </td>
                      <td>{entry[1]}</td>
                      <td>{entry[2]}</td>
                      <td>{entry[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-between mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setViewHistory(false)}>Back</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete Selected</button>
              </div>
            </div>
          ) : (
            <form id="medical-history-form" onSubmit={handleSave}>
              <table className="table table-striped blue-table">
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Incident</th>
                    <th scope="col">Treatment</th>
                  </tr>
                </thead>
                <tbody id="medicalHistoryTableBody">
                  {medicalHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          className="form-input"
                          value={entry.year}
                          onChange={(e) => handleChange(index, 'year', e.target.value)}
                        >
                          <option value="">Select Year</option>
                          {yearOptions}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          value={entry.incident}
                          onChange={(e) => handleChange(index, 'incident', e.target.value)}
                          placeholder="Incident"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          value={entry.treatment}
                          onChange={(e) => handleChange(index, 'treatment', e.target.value)}
                          placeholder="Treatment"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-between mt-2">
                <button type="button" className="btn btn-primary" onClick={handleAddRow}>Add Row</button>
                <div>
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn btn-info ml-2" onClick={fetchFullHistory}>History</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medical;