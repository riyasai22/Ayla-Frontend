import React, { Component } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
      details: null,
      scanning: true, // Add a flag to control scanning
    };

    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(data) {
    if (!this.state.scanning) {
      // Stop scanning if the flag is false
      return;
    }

    this.setState({
      result: data,
    });

    if (data !== null && data !== "No result") {
      console.log(data);
      // Stop scanning
      this.setState({
        scanning: false,
      });

      // Make an Axios call to fetch user details
      axios
        .get(`${process.env.REACT_APP_BACKEND_URI}/check?invite=${data.text}`)
        .then((response) => {
          this.setState({
            details: response.data,
          });
          // Reset scanning and result for the next scan
          this.setState({
            scanning: true,
            result: "No result",
          });
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          // Reset scanning for the next scan even in case of an error
          this.setState({
            scanning: true,
          });
        });
    }
  }

  handleError(err) {
    console.error(err);
  }

  render() {
    const previewStyle = {
      height: 240,
      width: 320,
    };

    return (
      <div className="verification">
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
        />
        <p>{this.state.result && this.state.result.text}</p>

        {this.state.details && (
          <div>
            <h2>User Details:</h2>
            <p>Name: {this.state.details.name}</p>
            <p>Email: {this.state.details.email}</p>
            <p>Phone: {this.state.details.phone}</p>
            <h3>Children:</h3>
            {this.state.details.children.map((child, index) => (
              <div key={index}>
                <p>Name: {child.name}</p>
                <p>Age: {child.age}</p>
                <p>Gender: {child.gender}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default QRCodeScanner;

// import React, { useState } from "react";
// // import { QrReader } from "react-qr-reader";

// const QRCodeScanner = (props) => {
//   const [data, setData] = useState("No result");
//   const [startCam, setStartCam] = useState(false);
//   const [stopCam, setStopCam] = useState(false); // Flag to stop the camera

//   const handleScan = (result, error) => {
//     if (!!result) {
//       setData(result?.text);

//       // Set the stopCam flag to true when QR code is scanned
//       setStopCam(true);

//       // Add a slight delay before closing the camera
//       setTimeout(() => {
//         setStartCam(false);
//       }, 500); // Adjust the delay as needed
//     }

//     if (!!error) {
//       console.info(error);
//     }
//   };

//   const startScanning = () => {
//     setStartCam(true);
//     setStopCam(false); // Reset the stopCam flag
//   };

//   return (
//     <>
//       <button onClick={startScanning} disabled={stopCam}>
//         Scan QR Pass
//       </button>
//       {/* {startCam && (
//         <QrReader
//           onResult={handleScan}
//           style={{ maxHeight: "300px", maxWidth: "300px" }}
//         />
//       )} */}

//       <p>{data}</p>
//     </>
//   );
// };

// export default QRCodeScanner;
