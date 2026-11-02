import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, X, Check } from 'lucide-react';

function UploadBox({ image, preview, handleImageUpload, handleAnalyze, loading, errorMsg }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Camera Start Karne ka Function
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Back camera
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera access nahi mila. Kripya permission dein.");
      setIsCameraOpen(false);
    }
  };

  // Camera Band Karne ka Function
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Photo Click Karne ka Function
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          // App.jsx wale function ko call karein
          handleImageUpload({ target: { files: [file] } });
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Component unmount hone par camera band karein
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="upload-section glass-panel">
      <div className="section-header">
        <h2>Upload Prescription</h2>
        <span className="step-badge">Step 1</span>
      </div>
      
      {/* Agar Camera Khula Hai Toh Video Dikhao */}
      {isCameraOpen ? (
        <div className="camera-container">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="camera-feed"
          ></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          
          <div className="camera-controls">
            <button onClick={stopCamera} className="camera-btn cancel"><X size={20} /></button>
            <button onClick={capturePhoto} className="camera-btn capture"><Check size={28} /></button>
          </div>
        </div>
      ) : (
        <>
          <div className={`scanner-box ${preview ? 'has-preview' : ''}`}>
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Prescription" className="preview-img" />
                <label htmlFor="file-upload" className="change-btn">
                  <ImageIcon size={16} /> Change Image
                </label>
              </div>
            ) : (
              <div className="upload-options">
                {/* 1. File Upload Option */}
                <label htmlFor="file-upload" className="upload-placeholder">
                  <div className="upload-icon-wrapper">
                    <UploadCloud size={32} color="#8B5CF6" />
                  </div>
                  <h3>Upload from Gallery</h3>
                  <p>JPG, PNG supported</p>
                </label>

                <div className="divider">OR</div>

                {/* 2. Camera Option */}
                <button onClick={startCamera} className="upload-placeholder camera-option">
                  <div className="upload-icon-wrapper">
                    <Camera size={32} color="#10B981" />
                  </div>
                  <h3>Open Camera</h3>
                  <p>Scan prescription live</p>
                </button>
              </div>
            )}
            
            {/* File Input (Hidden by default) */}
           <input 
  type="file" 
  accept="image/*" 
  onChange={handleImageUpload} 
  className="file-input" 
  id="file-upload" 
  style={{ display: 'none', visibility: 'hidden', position: 'absolute', width: '0', height: '0' }} 
/>
          </div>

          {/* Run AI Analysis Button */}
          <button onClick={handleAnalyze} disabled={loading || !image} className="btn-glow">
            {loading ? (
              <span className="btn-loading"><div className="spinner-small"></div> Scanning Data...</span>
            ) : (
              <><span className="icon">⚡</span> Run AI Analysis</>
            )}
          </button>
        </>
      )}

      {errorMsg && <div className="error-alert">{errorMsg}</div>}
    </div>
  );
}

export default UploadBox;