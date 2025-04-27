import { useState } from "react";
import "./App.css";
import { FaUpload, FaCheckCircle, FaSpinner } from "react-icons/fa";
import pawIcon from "/paw.svg";

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setResult(null);
    setError(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append("file", image);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center animate-fadeIn">
        <img src={pawIcon} alt="Paw Icon" className="paw-icon mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-purple-700 flex items-center gap-2">
          Pet Breed Identifier
        </h1>
        <label className="cursor-pointer flex flex-col items-center gap-2 bg-purple-100 hover:bg-purple-200 transition p-4 rounded-xl border-2 border-dashed border-purple-300 mb-4">
          <FaUpload className="text-2xl text-purple-400" />
          <span className="text-purple-600 font-medium">Upload your Pet🐶Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-xl shadow mb-4 border-4 border-purple-200 animate-popIn"
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={!image || loading}
          className="identify-btn"
        >
          <span className="btn-content">
            {loading ? (
              <FaSpinner className="btn-icon spin" />
            ) : (
              <FaCheckCircle className="btn-icon" />
            )}
            <span>{loading ? "Identifying..." : "Identify Breed"}</span>
          </span>
        </button>
        {result && (
          <div className="result-card">
            <span className="result-label">
              <FaCheckCircle className="result-icon" />
              <span className="result-text">{result.label}</span>
            </span>
            <span className="result-confidence">
              Confidence: {(result.score * 100).toFixed(2)}%
            </span>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-xl shadow text-red-700 animate-fadeIn">
            {error}
          </div>
        )}
      </div>
      <style>
        {`
          .animate-fadeIn { animation: fadeIn 0.7s ease; }
          .animate-popIn { animation: popIn 0.4s cubic-bezier(.68,-0.55,.27,1.55); }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0;}
            100% { transform: scale(1); opacity: 1;}
          }
        `}
      </style>
    </div>
  );
}
