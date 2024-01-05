import React, { useState, useEffect } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";

const MapComponenttt = ({ coordinates, setCoordinates }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapElement = document.getElementById("map");

    if (mapElement && mapElement.children.length > 0) {
      return;
    }

    if (!map) {
      const mapInstance = new Map({
        target: "map",
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({ center: fromLonLat([0, 0]), zoom: 2 }),
      });

      mapInstance.on("click", (event) => {
        const clickedCoordinate = toLonLat(event.coordinate);
        setCoordinates({
          latitude: clickedCoordinate[1].toFixed(5),
          longitude: clickedCoordinate[0].toFixed(5),
        });
      });

      setMap(mapInstance);
    }
  }, [map, setCoordinates]);

  return <div id="map" style={{ width: "100%", height: "700px" }}></div>;
};

export default MapComponenttt;
