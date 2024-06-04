import React, { useState } from "react";

function QrCode() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [scannedData, setScannedData] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleClick = async () => {
    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          input
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      setCode(response.url);
    } catch (error) {
      console.error(error);
    }
  };

  const scanCode = async () => {
    if (!fileInput) {
      alert("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileInput);

      const response = await fetch(
        "https://api.qrserver.com/v1/read-qr-code/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        alert("Failed to scan QR code");
        throw new Error("Failed to scan QR code");
      }

      const result = await response.json();
      console.log(result);
      setScannedData(result[0].symbol[0].data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center gap-4 p-5 text-white">
      <h1 className="text-5xl font-bold text-red-700">QR CODE GENERATOR</h1>
      <div>
        <input
          type="text"
          className="p-2 w-80 text-gray-500"
          placeholder="Enter the text"
          onChange={handleChange}
          value={input}
        />
        <p className="text-white text-2xl m-6">Please paste text or URL</p>
      </div>
      <button className="bg-red-700 p-2" onClick={handleClick}>
        Generate Code
      </button>

      {code && <img src={code} alt="Generated QR Code"></img>}

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">Scan the QR code</h1>
        <input
          type="file"
          name="Scan"
          onChange={(e) => setFileInput(e.target.files[0])}
        />
        <button className="bg-red-700 p-2" onClick={scanCode}>
          Scan
        </button>
        {scannedData && <p>{scannedData}</p>}
      </div>
    </div>
  );
}

export default QrCode;
