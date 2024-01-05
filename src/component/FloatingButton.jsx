import React from "react";

const FloatingButton = ({ toggleConversionForm }) => {
  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
    fontFamily: "'Arial', sans-serif",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    outline: "none",
    marginBottom: "20px",
  };

  return (
    <button
      onClick={toggleConversionForm}
      style={buttonStyle}
      aria-label="Toggle Conversion Form"
    >
      Konversi Koordinat
    </button>
  );
};

export default FloatingButton;
