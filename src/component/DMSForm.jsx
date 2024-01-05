import React from "react";

const DMSForm = ({ coordinates, setCoordinates }) => {
  const inputStyle = {
    marginBottom: "20px",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    fontFamily: "'Arial', sans-serif",
  };

  const handleLatitudeChange = (e) => {
    setCoordinates({ ...coordinates, latitude: e.target.value });
  };

  const handleLongitudeChange = (e) => {
    setCoordinates({ ...coordinates, longitude: e.target.value });
  };

  return (
    <>
      <div>
        <label>Latitude (DMS):</label>
        <input
          type="text"
          placeholder="49°30'10&quot; N"
          value={coordinates.latitude}
          style={inputStyle}
          onChange={handleLatitudeChange}
          aria-label="Input Latitude in DMS format"
          aria-describedby="latitudeDescription"
        />
        <small id="latitudeDescription">
          Masukkan dalam format: 49°30'10&quot; N
        </small>
      </div>
      <div>
        <label>Longitude (DMS):</label>
        <input
          type="text"
          placeholder="123°30'20&quot; W"
          value={coordinates.longitude}
          style={inputStyle}
          onChange={handleLongitudeChange}
          aria-label="Input Longitude in DMS format"
          aria-describedby="longitudeDescription"
        />
        <small id="longitudeDescription">
          Masukkan dalam format: 123°30'20&quot; W
        </small>
      </div>
    </>
  );
};

export default DMSForm;
