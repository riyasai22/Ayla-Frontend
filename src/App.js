import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import RegistrationForm from "./components/RegistrationForm";
import Invitation from "./components/Invitation";
import QRCodeScanner from "./components/QRCodeScanner";
import Login from "./components/Login";
import Admin from "./components/Admin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<RegistrationForm />} />
        <Route exact path="/invitation" element={<Invitation />} />
        <Route exact path="/verify" element={<QRCodeScanner />} />
        <Route exact path="/admin" element={<Login />} />
        <Route exact path="/admin/details" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
