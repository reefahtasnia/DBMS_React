import React, { useEffect, useState } from "react";
import "./medicine.css";

const MedicineTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe parsing of the 'user' object from localStorage
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage:", error);
      return null;
    }
  };

  const auth = getUserFromLocalStorage();
  const userId = auth ? auth.userId : null;
  console.log("Retrieved userId:", userId); // Debug log the userId

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", time: "" },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    console.log("UseEffect retrieved userId:", userId);
    populateMedicines();
  }, [userId]);

  const populateMedicines = async () => {
    try {
      const response = await fetch("http://localhost:3000/medicine-options");
      const data = await response.json();
      setMedicineOptions(data);
      console.log("Medicine options fetched:", data);
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
        const filteredSuggestions = medicineOptions.filter((option) =>
          option.name.toLowerCase().includes(query)
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", time: "", userid: userId },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      userId: userId,
      medicines: medicines,
    };
    console.log(payload);

    try {
      const responsePost = await fetch("http://localhost:5000/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (responsePost.ok) {
        const data = await responsePost.json();
        setPrescriptions([...prescriptions, ...data]);
        setSubmitted(true);
        clearForm();
        setIsModalOpen(false);
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
    console.log("Deleting prescription with ID:", prescription.id);
    if (prescription) {
      try {
        const response = await fetch(
          `http://localhost:5000/medicine/${prescription.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (response.ok) {
          const updatedPrescriptions = prescriptions.filter(
            (_, i) => i !== index
          );
          setPrescriptions(updatedPrescriptions);
        } else {
          alert("Failed to delete the prescription.");
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
    setEditIndex(index);
    setMedicines([
      {
        name: prescription.name,
        dosage: prescription.dosage,
        time: prescription.time,
        userid: userId, // Ensure userId is passed in case it's not in the original
      },
    ]);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (editIndex === null) return;

    const prescription = { ...medicines[0], userId }; // Include userId in the payload
    const prescriptionId = prescriptions[editIndex].id;

    try {
      const response = await fetch(
        `http://localhost:5000/medicine/${prescriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescription),
        }
      );

      if (response.ok) {
        const updatedPrescriptions = prescriptions.map((item, i) =>
          i === editIndex ? { ...item, ...prescription } : item
        );
        setPrescriptions(updatedPrescriptions);
        clearForm();
        setIsModalOpen(false);
        setEditIndex(null);
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
