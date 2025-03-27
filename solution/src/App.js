import React, { useState, useEffect } from "react";
import { isNameValid, getLocations } from "./mock-api/apis";
import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [isNameTaken, setIsNameTaken] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [entries, setEntries] = useState(
    Array(5).fill({ name: "", location: "" })
  ); // Start with 5 blank entries
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const handleNameChange = async (e) => {
    const newName = e.target.value;
    setName(newName);

    if (newName.trim() === "") {
      setIsNameTaken(false);
      return;
    }

    const isValid = await isNameValid(newName);
    setIsNameTaken(!isValid);
  };

  const handleAdd = async () => {
    if (!name.trim() || !selectedLocation) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setErrorMessage("");

    const isValid = await isNameValid(name);
    if (!isValid) {
      setErrorMessage("This name has already been taken.");
      return;
    }

    const newEntry = { name, location: selectedLocation };
    setEntries((prevEntries) => {
      const emptyIndex = prevEntries.findIndex(
        (entry) => !entry.name && !entry.location
      );
      if (emptyIndex !== -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[emptyIndex] = newEntry;
        return updatedEntries;
      }
      return [...prevEntries, newEntry];
    });

    setName("");
    setSelectedLocation("");
  };

  const handleClear = () => {
    setName("");
    setIsNameTaken(false);
    setSelectedLocation("");
  };

  const handleClearTable = () => {
    setEntries(Array(5).fill({ name: "", location: "" }));
  };

  return (
    <div className="container">
      <h2>Location Test Form</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter name"
      />
      {errorMessage && <p className="error">{errorMessage}</p>}

      <label>Location</label>
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        <option value="">Select Location</option>
        {locations.map((loc, index) => (
          <option key={index} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <div className="buttons">
        <button onClick={handleClear}>Clear</button>
        <button
          onClick={handleAdd}
          className={
            name.trim() && selectedLocation ? "add-btn enabled" : "add-btn"
          }
          disabled={!name.trim() || !selectedLocation}
        >
          Add
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name || "-"}</td>
              <td>{entry.location || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-bottom-buttons">
        <button onClick={handleClearTable} className="clear-table-btn">
          Clear Table
        </button>
      </div>
    </div>
  );
};

export default App;
