import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";

const Invitation = () => {
  const [aylaArray, setAylaArray] = useState([]);

  useEffect(() => {
    // Fetch the "ayla" array from localStorage
    const aylaData = localStorage.getItem("ayla");
    if (aylaData) {
      const parsedAylaArray = JSON.parse(aylaData);
      setAylaArray(parsedAylaArray);
    }
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  const downloadInvite = (item) => {
    const inviteItemElement = document.getElementById(`invite-item-${item}`);
    const buttonElement = inviteItemElement.querySelector(".download");
    buttonElement.style.display = "none"; // Hide the download button

    html2canvas(inviteItemElement).then((canvas) => {
      buttonElement.style.display = "block"; // Restore the download button
      const pngImage = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngImage;
      a.download = `invite${item}.png`;
      a.click();
    });
  };

  return (
    <div className="invitation">
      <h2>Invitation</h2>
      <div className="invitation_list">
        {aylaArray.map((item) => (
          <div key={item} id={`invite-item-${item}`} className="invite_item">
            <img
              src="template_tree.png"
              alt="invitation"
              className="tree-image"
            />
            <QRCode value={item} size={128} className="qr-code" />
            <button className="download" onClick={() => downloadInvite(item)}>
              <FaDownload className="icon" />
              Download Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invitation;
