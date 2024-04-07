// src/App.js
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [convertedCoords, setConvertedCoords] = useState('');
  const mapRef = useRef(null);

  const convertCoords = () => {
    // Implement the conversion logic from DD to DMS
    // and set the converted coordinates

    // Conversion function from Decimal Degrees (DD) to Degrees, Minutes, Seconds (DMS)
    const ddToDms = (coordinate) => {
        const absolute = Math.abs(coordinate);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
        return `${degrees}° ${minutes}' ${seconds}" ${coordinate >= 0 ? 'N' : 'S'}`;
    };

    // Convert latitude and longitude to DMS
    const convertedLatitude = ddToDms(latitude);
    const convertedLongitude = ddToDms(longitude);

    // Set the converted coordinates
    setConvertedCoords(`${convertedLatitude}, ${convertedLongitude}`);

    // Save data to server
    fetch('/saveCoords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save coordinates');
        }
        console.log('Coordinates saved successfully');
    })
    .catch(error => {
        console.error('Error saving coordinates:', error);
    });
};
  useEffect(() => {
    // Initialize the map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 27.9659, lng: -82.8001 }, // Tampa Bay, Florida
      zoom: 8,
    });

    // Optionally, add marker for the coordinates
    if (latitude && longitude) {
      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        map: map,
        title: 'Coordinates Location',
      });
    }
  }, [latitude, longitude]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        <input
          type="text"
          placeholder="Latitude (Decimal Degrees)"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="mb-2 md:mb-0 md:mr-4 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Longitude (Decimal Degrees)"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <button onClick={convertCoords} className="bg-blue-500 text-white py-2 px-4 rounded">
        Convert Coords
      </button>
      <div className="mt-4">
        <p>Converted Coords: {convertedCoords}</p>
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
}

export default App;



