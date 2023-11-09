import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = (props) => {
  const [data, setData] = useState("No result");
  const [startCam, setStartCam] = useState(false);
  const [stopCam, setStopCam] = useState(false); // Flag to stop the camera

  const handleScan = (result, error) => {
    if (!!result) {
      setData(result?.text);

      // Set the stopCam flag to true when QR code is scanned
      setStopCam(true);

      // Add a slight delay before closing the camera
      setTimeout(() => {
        setStartCam(false);
      }, 500); // Adjust the delay as needed
    }

    if (!!error) {
      console.info(error);
    }
  };

  const startScanning = () => {
    setStartCam(true);
    setStopCam(false); // Reset the stopCam flag
  };

  return (
    <>
      <button onClick={startScanning} disabled={stopCam}>
        Scan QR Pass
      </button>
      {startCam && (
        <QrReader
          onResult={handleScan}
          style={{ maxHeight: "300px", maxWidth: "300px" }}
        />
      )}

      <p>{data}</p>
    </>
  );
};

export default QRCodeScanner;
