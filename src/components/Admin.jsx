import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { FaFileExcel } from "react-icons/fa";
import Select from "react-select";

const Admin = () => {
  const [details, setDetails] = useState([]);
  const [displayType, setDisplayType] = useState("all");
  const [downloadFileName, setDownloadFileName] = useState("table");

  const tableRef = useRef(null);

  let currentIndex = 0;

  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}/api/parents`
      );
      if (res.status === 200) {
        setDetails(res.data);
      }
    } catch (err) {
      console.error("Failed fetching details", err);
    }
  };

  const download = () => {
    // Update the filename based on displayType and the current time
    const currentTime = new Date().toISOString().replace(/[-:]/g, "");
    const newFileName = `${displayType}_${currentTime}`;
    setDownloadFileName(newFileName);
  };
  const options = [
    { value: "", label: "Filter By", isDisabled: true },
    { value: "all", label: "Show All" },
    { value: "parents", label: "Parents Only" },
    { value: "children", label: "Children Only" },
  ];
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isDisabled
        ? "#dddddd"
        : state.isSelected
        ? "#ef3838"
        : "white",
      color: state.isSelected ? "white" : "black",
      borderColor: state.isSelected ? "#ef3838" : "black",
    }),
  };

  useEffect(() => {
    // Check if the "ayla-admin-cookie" is present in local storage
    const adminCookie = localStorage.getItem("ayla-admin-cookie");
    if (!adminCookie) {
      window.location.href = "/admin";
    }

    fetchDetails();
  }, []);

  return (
    <div className="details-container">
      <h2>Details</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "60%",
          justifyContent: "space-between",
        }}
      >
        {/* Filter dropdowns */}

        <Select
          options={options}
          value={options.find((option) => option.value === displayType)}
          onChange={(selectedOption) =>
            setDisplayType(selectedOption.value || "")
          }
          styles={customStyles}
        />

        <DownloadTableExcel
          filename="ayla-tree-lighting-23"
          sheet={downloadFileName}
          currentTableRef={tableRef.current}
        >
          <button className="export" onClick={download}>
            <FaFileExcel className="icon" /> Export to Excel
          </button>
        </DownloadTableExcel>
      </div>

      <table className="christmas-table" ref={tableRef}>
        <thead>
          <tr>
            <th>SNo.</th>
            <th>Invite ID</th>
            <th>Name</th>
            {displayType === "all" && <th>Email</th>}
            {displayType === "all" && <th>Phone</th>}
            {displayType === "parents" && <th>Email</th>}
            {displayType === "parents" && <th>Phone</th>}
            {(displayType === "children" || displayType === "all") && (
              <th>Age</th>
            )}
            {(displayType === "children" || displayType === "all") && (
              <th>Gender</th>
            )}
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {details.map((participant, index) => (
            <React.Fragment key={participant._id.$oid}>
              {/* Parent row */}
              {(displayType === "all" || displayType === "parents") && (
                <tr>
                  <td>{++currentIndex}</td>
                  <td>{participant._id}</td>
                  <td>{participant.name}</td>
                  {displayType === "all" && <td>{participant.email}</td>}
                  {displayType === "all" && <td>{participant.phone}</td>}
                  <td>{participant.email}</td>
                  <td>{participant.phone}</td>
                  <td>Parent</td>
                </tr>
              )}

              {/* Children rows */}
              {(displayType === "all" || displayType === "children") &&
                participant.children.map(
                  (child, childIndex) =>
                    child.name !== "" && (
                      <tr key={child._id.$oid}>
                        <td>{++currentIndex}</td>
                        <td>{participant._id}</td>
                        <td>{child.name}</td>
                        {displayType === "all" && <td></td>}
                        {displayType === "all" && <td></td>}

                        <td>{child.age}</td>
                        <td>{child.gender}</td>
                        <td>Child</td>
                      </tr>
                    )
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
