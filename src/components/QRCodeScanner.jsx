import React, { Component, useState } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";

class QRCodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: "No result",
      details: null,
      // details: {
      //   name: "Riya Sailesh",
      //   phone: "508297917",
      //   email: "riyasailesh@gmail.com",
      //   attended: "false",
      //   children: [{ name: "Raj", age: 8, gender: "Female" }],
      // },
      scanning: true, // Add a flag to control scanning
      inviteCode: "",
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
  // Add handleChange function to update inviteCode state
  handleChange = (e) => {
    this.setState({
      inviteCode: e.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URI}/check?invite=${this.state.inviteCode}`
      )
      .then((response) => {
        this.setState({
          details: response.data,
        });
        this.setState({
          scanning: true,
          result: "No result",
        });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        this.setState({
          scanning: true,
        });
      });
  };

  render() {
    const previewStyle = {
      height: 620,
      width: 620,
    };

    return (
      <div className="verification">
        <div className="scanner">
          <h2>Scan Invitation Code</h2>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="invitecode"
              value={this.state.inviteCode}
              onChange={this.handleChange}
              placeholder="Enter Invitation Code"
            />
            <button type="submit">Get Details</button>
          </form>

          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
          <p className="result-text">
            <strong>Invitation Code:</strong>
            {this.state.result && this.state.result.text}
          </p>
        </div>

        {this.state.details && (
          <div className="user-details">
            <h2>User Info</h2>
            <h3>Parent Details:</h3>

            <div className="parent-details">
              <p>Name: {this.state.details.name}</p>
              <p>Email: {this.state.details.email}</p>
              <p>Phone: +971{this.state.details.phone}</p>
            </div>
            <h3>Children:</h3>
            <div className="children-list">
              {this.state.details.children.map((child, index) => (
                <div key={index} className="child-details">
                  <p>Name: {child.name}</p>
                  <p>Age: {child.age}</p>
                  <p>Gender: {child.gender}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default QRCodeScanner;
// {/* <div className="user-details">
//         <h2>User Info</h2>
//         <h3>Parent Details:</h3>

//         <div className="parent-details">
//           <p>Name: Riya Sailesh</p>
//           <p>Email: riyasailesh@gmail.com</p>
//           <p>Phone: +971503486374</p>
//         </div>
//         <h3>Children:</h3>
//         <div className="children-list">
//           <div className="child-details">
//             <p>Name: K.B. Sailesh</p>
//             <p>Age: 12</p>
//             <p>Gender: Female</p>
//           </div>
//           <div className="child-details">
//             <p>Name: K.B. Sailesh</p>
//             <p>Age: 12</p>
//             <p>Gender: Female</p>
//           </div>
//           <div className="child-details">
//             <p>Name: K.B. Sailesh</p>
//             <p>Age: 12</p>
//             <p>Gender: Female</p>
//           </div>
//         </div>
//       </div> */}
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
