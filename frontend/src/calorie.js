import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const CalorieTracker = () => {
  const [date, setDate] = useState("");
  const [foodItem, setFoodItem] = useState("");
  const [servings, setServings] = useState(1); // State for servings
  const [totalCalories, setTotalCalories] = useState(0);
  const [foodOptions, setFoodOptions] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    populateFoodOptions();
    setDefaultDate();
  }, []);

  const populateFoodOptions = async () => {
    try {
      const response = await fetch("http://localhost:3000/calories");
      const data = await response.json();
      setFoodOptions(data);
    } catch (error) {
      console.error("Error fetching food calorie data:", error);
    }
  };

  const setDefaultDate = () => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    updateCalorieDisplay(today);
  };

  const updateCalorieDisplay = async (selectedDate) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user-data/${selectedDate}`
      );
      const data = await response.json();
      updateFoodList(data);

      const totalResponse = await fetch(
        `http://localhost:3000/user-data2/${selectedDate}`
      );
      const totalData = await totalResponse.json();
      setTotalCalories(totalData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateFoodList = (data) => {
    if (Array.isArray(data)) {
      setFoodList(data);
    } else {
      setFoodList([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lowerCaseFoodItem = foodItem.toLowerCase();

    try {
      const response = await fetch("http://localhost:3000/calories");
      const data = await response.json();
      const foodData = data.find(
        (item) => item[0].toLowerCase() === lowerCaseFoodItem
      );

      if (!foodData) {
        alert("Food item not found in the database.");
        return;
      }

      const calories = foodData[1] * servings; // Multiply calories by servings
      const responsePost = await fetch("http://localhost:3000/user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_of_entry: date,
          foodItem: lowerCaseFoodItem,
          calories,
          servings, // Include servings in the data
        }),
      });

      if (responsePost.ok) {
        updateCalorieDisplay(date);
        clearForm();
      } else {
        alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  const handleDelete = async (foodItem) => {
    try {
      const response = await fetch("http://localhost:3000/user-data", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date_of_entry: date, foodItem }),
      });

      if (response.ok) {
        updateCalorieDisplay(date);
      } else {
        alert("Error deleting data.");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
    }
  };

  const clearForm = () => {
    setFoodItem("");
    setServings(1); // Reset servings
  };

  const handleInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setFoodItem(query);
    if (query.length > 0) {
      const filteredSuggestions = foodOptions.filter((option) =>
        option[0].toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="container">
      <h1>Calorie Counter</h1>
      <form id="calorie-form" onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            updateCalorieDisplay(e.target.value);
          }}
          required
        />

        <label htmlFor="food-item">Food Item:</label>
        <input
          type="text"
          id="food-item"
          name="food-item"
          value={foodItem}
          onChange={handleInputChange}
          required
          list="food-suggestions"
          autoComplete="off"
        />
        <datalist id="food-suggestions">
          {suggestions.map((item) => (
            <option key={item[0]} value={item[0]}>
              {item[0]} ({item[1]} calories)
            </option>
          ))}
        </datalist>

        <label htmlFor="servings">Servings:</label>
        <input
          type="number"
          id="servings"
          name="servings"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          required
        />

        <button type="submit">Add</button>
      </form>
      <h2>
        Total Calories on <span id="current-date">{date}</span>:{" "}
        <span id="total-calories">{totalCalories}</span>
      </h2>
      <ul id="food-list">
        {foodList.map((entry, index) => (
          <li key={index}>
            {`${entry[1]}: ${entry[2]} calories`}{" "}
            <button onClick={() => handleDelete(entry[1])}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalorieTracker;
