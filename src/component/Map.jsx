import React, { useState, useEffect } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [conversionType, setConversionType] = useState("DMS");
  const [convertedResult, setConvertedResult] = useState("");

  useEffect(() => {
    const mapElement = document.getElementById("map");

    if (mapElement && mapElement.children.length > 0) {
      return;
    }

    initializeMap();
  }, []);

  const initializeMap = () => {
    if (!map) {
      const mapInstance = new Map({
        target: "map",
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({ center: fromLonLat([0, 0]), zoom: 2 }),
      });

      mapInstance.on("click", (event) => {
        console.log("Peta diklik", event.coordinate);
        const coordinate = event.coordinate;
        displayPopup(coordinate);
      });

      setMap(mapInstance);
    }
  };

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

  const renderConversionForm = () => (
    <div id="conversionForm" style={formStyle}>
      <h3 style={headerStyle}>Form Konversi Koordinat</h3>
      <select
        onChange={(e) => setConversionType(e.target.value)}
        style={selectStyle}
      >
        <option value="DMS">DMS to DD</option>
        <option value="DD">DD to DMS</option>
      </select>
      {conversionType === "DMS" ? renderDMSForm() : renderDDForm()}
      <button onClick={handleConvert} style={buttonStyleForm}>
        Konversi
      </button>
      {convertedResult && <div>Hasil Konversi: {convertedResult}</div>}

      <button onClick={toggleMarkerDisplay} style={buttonStyleForm}>
        {showMarker ? "Hide Marker" : "Add to Maps"}
      </button>
    </div>
  );

  const renderDMSForm = () => (
    <>
      <div>
        <label>Latitude (DMS):</label>
        <input
          type="text"
          placeholder="49°30'10&quot; N"
          value={coordinates.latitude}
          style={inputStyle}
          onChange={(e) =>
            setCoordinates({ ...coordinates, latitude: e.target.value })
          }
        />
      </div>
      <div>
        <label>Longitude (DMS):</label>
        <input
          type="text"
          placeholder="123°30'20&quot; W"
          value={coordinates.longitude}
          style={inputStyle}
          onChange={(e) =>
            setCoordinates({ ...coordinates, longitude: e.target.value })
          }
        />
      </div>
    </>
  );

  const renderDDForm = () => (
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

  const addMarkerToMap = () => {
    removeExistingMarkers();
    const marker = createMarkerFeature();
    const vectorLayer = createVectorLayer(marker);
    map.addLayer(vectorLayer);
    centerMapToMarker(marker);
  };

  const toggleMarkerDisplay = () => {
    setShowMarker(!showMarker);

    if (!showMarker) {
      addMarkerToMap();
    } else {
      map.getLayers().forEach((layer) => {
        if (layer instanceof VectorLayer) {
          map.removeLayer(layer);
        }
      });
    }
  };

  const removeExistingMarkers = () => {
    map.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        map.removeLayer(layer);
      }
    });
  };

  const createMarkerFeature = () => {
    const markerFeature = new Feature({
      geometry: new Point(
        fromLonLat([
          parseFloat(coordinates.longitude),
          parseFloat(coordinates.latitude),
        ])
      ),
    });

    markerFeature.on("click", () => {
      displayPopupOnClick(markerFeature);
    });

    return markerFeature;
  };

  const createVectorLayer = (marker) => {
    const vectorSource = new VectorSource({
      features: [marker],
    });
    return new VectorLayer({
      source: vectorSource,
    });
  };

  const centerMapToMarker = (marker) => {
    map.getView().setCenter(marker.getGeometry().getCoordinates());
  };

  const displayPopup = (coordinate) => {
    console.log("Menampilkan popup dengan koordinat:", coordinate);
    addPointToMap(coordinate);
    if (window.confirm("Simpan titik ini dan buka form konversi?")) {
      toggleConversionForm();
    }
  };

  const addPointToMap = (coordinate) => {
    console.log("Menambahkan titik ke peta dengan koordinat:", coordinate);

    if (!map) {
      console.warn("Objek peta masih belum diinisialisasi.");
      return;
    }

    const point = new Feature(new Point(coordinate));
    const vectorSource = new VectorSource({
      features: [point],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);
  };

  const displayPopupOnClick = () => {
    toggleConversionForm();
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

  const inputStyle = {
    marginBottom: "20px",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    fontFamily: "'Arial', sans-serif",
  };

  const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const buttonStyleForm = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    margin: "10px  0",
    marginRight: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px" }}></div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <button onClick={toggleConversionForm} style={buttonStyle}>
          Konversi Koordinat
        </button>
      </div>

      {showForm && renderConversionForm()}
    </div>
  );
};

export default MapComponent;
