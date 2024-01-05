import React from "react";

const DDForm = ({ coordinates, setCoordinates }) => (
  <>
    <div>
      <label>Latitude (DD):</label>
      <input
        type="text"
        placeholder="49.50278° N"
        value={coordinates.latitude}
        style={inputStyle}
        onChange={(e) =>
          setCoordinates({ ...coordinates, latitude: e.target.value })
        }
      />
    </div>
    <div>
      <label>Longitude (DD):</label>
      <input
        type="text"
        placeholder="123.50556° W"
        value={coordinates.longitude}
        style={inputStyle}
        onChange={(e) =>
          setCoordinates({ ...coordinates, longitude: e.target.value })
        }
      />
    </div>
  </>
);

const inputStyle = {
  marginBottom: "20px",
  padding: "10px",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "16px",
  fontFamily: "'Arial', sans-serif",
};

export default DDForm;
