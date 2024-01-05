import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Map from "../component/Map";

describe("Map", () => {
  it("renders without crashing", () => {
    render(<Map />);
    const mapElement = screen.getByTestId("map");
    expect(mapElement).toBeInTheDocument();
  });

  it("toggles conversion form visibility when button is clicked", () => {
    render(<Map />);
    const toggleButton = screen.getByText(/Konversi Koordinat/i);

    fireEvent.click(toggleButton);
    const conversionForm = screen.getByText(/Form Konversi Koordinat/i);
    expect(conversionForm).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(conversionForm).not.toBeInTheDocument();
  });

  it("performs coordinate conversion correctly", () => {
    render(<Map />);
    const toggleButton = screen.getByText(/Konversi Koordinat/i);

    fireEvent.click(toggleButton);

    const latitudeInput = screen.getByPlaceholderText("49°30'10\" N");
    const longitudeInput = screen.getByPlaceholderText("123°30'20\" W");

    fireEvent.change(latitudeInput, { target: { value: "49°30'10\" N" } });
    fireEvent.change(longitudeInput, { target: { value: "123°30'20\" W" } });

    const conversionDropdown = screen.getByLabelText(/Select conversion type/i);
    fireEvent.change(conversionDropdown, { target: { value: "DMS" } });

    const convertButton = screen.getByText(/Konversi/i);
    fireEvent.click(convertButton);

    const conversionResult = screen.getByText(/Latitude in DD:/i);
    expect(conversionResult).toBeInTheDocument();
  });
});
