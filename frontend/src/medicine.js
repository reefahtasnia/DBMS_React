import React, { useEffect, useState } from "react";
import "./medicine.css";

const MedicineTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", time: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]); // State to hold all submitted prescriptions
  const [editIndex, setEditIndex] = useState(null); // Track the index of the prescription being edited

  useEffect(() => {
    populateMedicines();
  }, []);

  const populateMedicines = async () => {
    try {
      const response = await fetch("http://localhost:3000/medicine-options"); // Assuming this endpoint exists for fetching options
      const data = await response.json();
      setMedicineOptions(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleMedicineChange = (index, event) => {
    const { name, value } = event.target;
    const newMedicines = medicines.map((medicine, i) => {
      if (i !== index) return medicine;
      return { ...medicine, [name]: value };
    });
    setMedicines(newMedicines);

    if (name === "name") {
      const query = value.toLowerCase();
      if (query.length > 0) {
        const filteredSuggestions = medicineOptions.filter(
          (option) => option.name && option.name.toLowerCase().includes(query)
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", time: "" }]);
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(medicines);

    try {
      const responsePost = await fetch("http://localhost:3000/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicines), // Sending the medicines array to the backend
      });

      if (responsePost.ok) {
        const data = await responsePost.json(); // Parse the response as JSON
        console.log("Received data:", data); // Log the received data to check structure

        // Map the returned data to include the id, name, dosage, and time
        const prescriptionsWithId = data.map((item) => ({
          id: item.id, // Ensure `id` is correctly mapped from the backend response
          name: item.name,
          dosage: item.dosage,
          time: item.time,
        }));

        // Update the prescriptions state with the new data
        setPrescriptions([...prescriptions, ...prescriptionsWithId]);
        setSubmitted(true);
        clearForm(); // Function to clear the form inputs after submission
        setIsModalOpen(false); // Close the modal after successful submission
      } else {
        alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  const clearForm = () => {
    setMedicines([{ name: "", dosage: "", time: "" }]);
    setSuggestions([]);
  };

  const removePrescription = async (index) => {
    const prescription = prescriptions[index];
    console.log(prescription.id);
    if (prescription) {
      try {
        const response = await fetch(
          `http://localhost:3000/medicine/${prescription.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const updatedPrescriptions = prescriptions.filter(
            (_, i) => i !== index
          );
          setPrescriptions(updatedPrescriptions);
        } else {
          alert("Failed to delete the prescription");
        }
      } catch (error) {
        console.error("Error deleting prescription:", error);
      }
    } else {
      console.error("Invalid prescription or missing ID");
    }
  };

  const editPrescription = async (index) => {
    const prescription = prescriptions[index];
    setEditIndex(index); // Set the editIndex to the current prescription index
    setMedicines([
      {
        name: prescription.name,
        dosage: prescription.dosage,
        time: prescription.time,
      },
    ]);
    setIsModalOpen(true); // Open the modal with the prescription data
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (editIndex === null) return;

    const prescription = medicines[0]; // Get the updated medicine data
    const prescriptionId = prescriptions[editIndex].id; // Get the ID of the prescription being edited

    try {
      const response = await fetch(
        `http://localhost:3000/medicine/${prescriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescription), // Send the updated prescription data
        }
      );

      if (response.ok) {
        const updatedPrescriptions = prescriptions.map((item, i) =>
          i === editIndex ? { ...item, ...prescription } : item
        );
        setPrescriptions(updatedPrescriptions); // Update the prescriptions list
        clearForm();
        setIsModalOpen(false);
        setEditIndex(null); // Reset the editIndex
      } else {
        alert("Failed to update the prescription.");
      }
    } catch (error) {
      console.error("Error updating prescription:", error);
    }
  };

  const closePopup = () => {
    setSubmitted(false);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="home.html">
            Maternity Maven
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav me-auto my-2 my-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="home.html">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Doctors
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Shop
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Resources
                </a>
              </li>
            </ul>
            <button
              className="btn"
              type="submit"
              id="loginButton"
              href="login.html"
            >
              Log In
            </button>
            <a href="/calorie">
              <button className="btn2" type="button" id="caloriebtn">
                Calorie Tracker
              </button>
            </a>
          </div>
        </div>
      </nav>

      <div className="appointment-form">
        <h1>Medicine Tracker</h1>
        <button
          className="check-availability"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {prescriptions.length > 0 && (
        <div className="prescriptions-list">
          <h2>Your Prescriptions:</h2>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="prescription-box">
              <div>
                <strong>Name:</strong> {prescription.name}
              </div>
              <div>
                <strong>Dosage:</strong> {prescription.dosage}
              </div>
              <div>
                <strong>Time:</strong> {prescription.time}
              </div>
              <button
                className="remove-prescription-btn"
                onClick={() => removePrescription(index)}
              >
                &times;
              </button>
              <button
                className="edit-prescription-btn"
                onClick={() => editPrescription(index)}
              >
                ✎
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div>
          <div
            className="modal-overlay active"
            onClick={() => setIsModalOpen(false)}
          />
          <div className={`modal ${isModalOpen ? "active" : ""}`}>
            <form
              id="prescription-form"
              onSubmit={editIndex !== null ? handleEditSubmit : handleSubmit}
            >
              <h2>
                {editIndex !== null ? "Edit Prescription" : "Add Prescription"}
              </h2>
              <div className="medicine-list">
                {medicines.map((medicine, index) => (
                  <div key={index} className="medicine-item">
                    <div className="form-group">
                      <label htmlFor={`name-${index}`}>
                        Name of the medicine:
                      </label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        name="name"
                        value={medicine.name}
                        onChange={(event) => handleMedicineChange(index, event)}
                        list={`medicine-suggestions-${index}`}
                        autoComplete="off"
                        required
                      />
                      <datalist id={`medicine-suggestions-${index}`}>
                        {suggestions.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`dosage-${index}`}>Dosage:</label>
                      <input
                        type="text"
                        id={`dosage-${index}`}
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(event) => handleMedicineChange(index, event)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`time-${index}`}>Time:</label>
                      <input
                        type="time"
                        id={`time-${index}`}
                        name="time"
                        value={medicine.time}
                        onChange={(event) => handleMedicineChange(index, event)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveMedicine(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="add-btn"
                onClick={handleAddMedicine}
              >
                Add Another Medicine
              </button>
              <button type="submit" className="submit-btn">
                {editIndex !== null ? "Save Changes" : "Submit"}
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {submitted && (
        <div id="popup" className="popup">
          <div className="popup-content">
            <span id="closePopupBtn" className="close" onClick={closePopup}>
              &times;
            </span>
            <p className="popup-text">
              Thank you for adding your prescription. Please keep an eye on your
              mail inbox for further details.
            </p>
            <button
              id="redirectBtn"
              className="check-availability"
              onClick={closePopup}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;
