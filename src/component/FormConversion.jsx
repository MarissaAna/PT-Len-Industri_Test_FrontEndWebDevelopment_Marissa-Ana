import React, { useState } from "react";
import DMSForm from "./DMSform";
import DDForm from "./DDForm";
import FloatingButton from "./FloatingButton";

const FormConversion = ({ onConvert }) => {
  const [conversionType, setConversionType] = useState("DMS");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });

  const [convertedResult, setConvertedResult] = useState("");
  const [showMarker, setShowMarker] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const toggleConversionForm = () => {
    setShowForm(!showForm);
  };

  const handleConvert = () => {
    let result = "";
    if (conversionType === "DMS") {
      const { latitude, longitude } = coordinates;
      const latParts = latitude.split(/[^\d\w]+/);
      const lonParts = longitude.split(/[^\d\w]+/);

      const latDegrees = parseFloat(latParts[0]);
      const latMinutes = parseFloat(latParts[1]);
      const latSeconds = parseFloat(latParts[2]);

      const lonDegrees = parseFloat(lonParts[0]);
      const lonMinutes = parseFloat(lonParts[1]);
      const lonSeconds = parseFloat(lonParts[2]);

      const latDD = latDegrees + latMinutes / 60 + latSeconds / 3600;
      const lonDD = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;

      result = `Latitude in DD: ${latDD.toFixed(
        5
      )}° N, Longitude in DD: ${lonDD.toFixed(5)}° W`;
    } else {
      const { latitude, longitude } = coordinates;
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      const latDegrees = Math.floor(lat);
      const latMinutes = Math.floor((lat - latDegrees) * 60);
      const latSeconds = ((lat - latDegrees - latMinutes / 60) * 3600).toFixed(
        2
      );

      const lonDegrees = Math.floor(lon);
      const lonMinutes = Math.floor((lon - lonDegrees) * 60);
      const lonSeconds = ((lon - lonDegrees - lonMinutes / 60) * 3600).toFixed(
        2
      );

      result = `Latitude in DMS: ${latDegrees}° ${latMinutes}' ${latSeconds}" N, Longitude in DMS: ${lonDegrees}° ${lonMinutes}' ${lonSeconds}" W`;
    }
    setConvertedResult(result);
    setShowMarker(false);
  };

  return (
    <div id="conversionForm" style={formStyle}>
      <FloatingButton toggleConversionForm={toggleConversionForm} />

      <h3 style={headerStyle}>Form Konversi Koordinat</h3>
      <select
        onChange={(e) => setConversionType(e.target.value)}
        style={selectStyle}
      >
        <option value="DMS">DMS to DD</option>
        <option value="DD">DD to DMS</option>
      </select>
      {conversionType === "DMS" ? (
        <DMSForm coordinates={coordinates} setCoordinates={setCoordinates} />
      ) : (
        <DDForm coordinates={coordinates} setCoordinates={setCoordinates} />
      )}
      <FloatingButton onClick={handleConvert} text="Konversi" />
      {convertedResult && <div>Hasil Konversi: {convertedResult}</div>}
    </div>
  );
};

const toggleConversionForm = () => {
  console.log("Toggle conversion form called");
  setShowForm(!showForm);
};

const formStyle = {
  padding: "30px",
  backgroundColor: "#f7f7f7",
  border: "2px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
  position: "absolute",
  top: "60%",
  right: "14%",
  transform: "translate(50%, -50%)",
  width: "350px",
  zIndex: 1001,
  fontFamily: "'Arial', sans-serif",
  color: "#333",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "24px",
  color: "#333",
  borderBottom: "2px solid #ccc",
  paddingBottom: "10px",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  marginBottom: "15px",
};

export default FormConversion;
