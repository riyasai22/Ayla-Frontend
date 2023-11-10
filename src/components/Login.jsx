import React, { useEffect, useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const user = process.env.REACT_APP_USERNAME;
  const pass = process.env.REACT_APP_PASSWORD;
  const handleLogin = () => {
    // Check if the entered credentials match
    if (username === user && password === pass) {
      // Generate a random unique code (you can use a library like uuid for this)
      const uniqueCode = generateRandomCode();

      // Store the unique code in local storage
      localStorage.setItem("ayla-admin-cookie", uniqueCode);

      // You can redirect the user to a different page or perform other actions upon successful login
      console.log("Login successful!");
      window.location.href = "/admin/details"; // Replace with the actual URL of your invitation page

      // Reset the form and error state
      setUsername("");
      setPassword("");
      setError("");
    } else {
      // If the credentials do not match, display an error message
      setError("Invalid username or password");
    }
  };

  const generateRandomCode = () => {
    // This is a simple example, you might want to use a more robust method
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
