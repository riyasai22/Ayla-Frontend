import React, { useState } from "react";
import Select from "react-select";
import Snow from "./Snowflake";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function RegistrationForm() {
  const [parentInfo, setParentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    children: [{ name: "", age: "", gender: "" }],
  });

  const handleInputChange = (e, childIndex) => {
    const { name, value } = e.target;
    if (childIndex !== undefined) {
      const updatedChildren = [...parentInfo.children];
      updatedChildren[childIndex][name] = value;
      setParentInfo({ ...parentInfo, children: updatedChildren });
    } else {
      setParentInfo({ ...parentInfo, [name]: value });
    }
  };

  const registerChild = () => {
    if (parentInfo.children.length < 3) {
      setParentInfo({
        ...parentInfo,
        children: [...parentInfo.children, { name: "", age: "", gender: "" }],
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URI}?email=${parentInfo.email}`
      );

      if (res.status === 200) {
        try {
          // Perform the registration only if the email is not already registered
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URI}/api/register`,
            parentInfo,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(response.data);
          const aylaData = localStorage.getItem("ayla");
          let aylaSection = aylaData ? JSON.parse(aylaData) : [];
          // Add the userId to the "ayla" array
          aylaSection.push(response.data._id);
          // Store the updated "ayla" array in localStorage
          localStorage.setItem("ayla", JSON.stringify(aylaSection));

          toast.success("User registration complete.");
          resetInputFields(); // Call a function to reset the input fields
          window.location.href = "/invitation"; // Replace with the actual URL of your invitation page
        } catch (error) {
          //          console.error("Registration failed:", error);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already registered.");
        // console.error("Error: Email already registered.");
      } else {
        // Handle other errors
        //   console.error("Error:", error);
      }
    }
  };
  // Function to reset input fields
  const resetInputFields = () => {
    setParentInfo({
      name: "",
      email: "",
      phone: "",
      children: [{ name: "", age: "", gender: "" }],
    });
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      // Styles for the outer container of the select
      ...provided,
      width: "150px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
      minHeight: "44px", // Adjust the height as needed
    }),
    singleValue: (provided) => ({
      // Styles for the selected value
      ...provided,
      color: "#333", // Adjust the text color as needed
    }),
    option: (provided, state) => ({
      // Styles for each option in the dropdown
      ...provided,
      background: state.isSelected ? "tomato" : "white", // Selected option background
      color: state.isSelected ? "white" : "#333", // Selected option text color
      fontSize: "16px",
    }),
  };

  return (
    <div className="container form_container">
      <ToastContainer />
      <Snow />
      <div className="form_wrapper">
        <div className="description_container">
          <div className="img">
            <img src="santa.png" alt="" />
          </div>
          <div className="tree_bottom">
            <img src="mini_tree.png" alt="tree-bottom" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Name<span>*</span>
            </label>
            <input
              className="normal-input"
              type="text"
              name="name"
              placeholder="Enter your name."
              value={parentInfo.name}
              onChange={(e) => handleInputChange(e)}
              required
            />
          </div>
          <div className="side_by_side">
            <div className="field">
              <label>
                Email<span>*</span>
              </label>
              <input
                className="normal-input"
                type="email"
                name="email"
                placeholder="Enter your email."
                value={parentInfo.email}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div className="field"></div>
            <div className="field">
              <label>
                Contact<span>*</span>
              </label>
              <div className="contact">
                <p className="span">+971</p>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number."
                  minLength={9}
                  maxLength={10}
                  value={parentInfo.phone}
                  onChange={(e) => handleInputChange(e)}
                  required
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {parentInfo.children.map((child, index) => (
            <div key={index}>
              <p className="child_number">Kid {index + 1}</p>
              <div className="child_item">
                <label>
                  Name<span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={child.name}
                  placeholder="Enter your child's name."
                  onChange={(e) => handleInputChange(e, index)}
                />
                <label>
                  Gender<span>*</span>
                </label>
                <Select
                  name="gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                  value={{ value: child.gender, label: child.gender }}
                  onChange={(selectedOption) =>
                    handleInputChange(
                      {
                        target: { name: "gender", value: selectedOption.value },
                      },
                      index
                    )
                  }
                  styles={customSelectStyles}
                />
                <label>
                  Age<span>*</span>
                </label>
                <input
                  type="text"
                  name="age"
                  value={child.age}
                  max={15}
                  min={0}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
            </div>
          ))}

          {parentInfo.children.length < 3 && (
            <button type="button" onClick={registerChild}>
              Register Child {parentInfo.children.length + 1} (Optional)
            </button>
          )}

          <button type="submit">Submit</button>
        </form>
        <div className="tree">
          <img src="tree-removebg.png" alt="tree" />
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
