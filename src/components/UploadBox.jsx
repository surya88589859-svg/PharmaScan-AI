import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, X, Check } from 'lucide-react';

function UploadBox({ image, preview, handleImageUpload, handleAnalyze, loading, errorMsg }) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
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

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

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
          handleImageUpload({ target: { files: [file] } });
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="upload-section">
      <div className="section-header">
        <h2>Upload Prescription</h2>
        <span className="step-badge">Step 1</span>
      </div>
      
      {isCameraOpen ? (
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          
          <div className="camera-controls">
            <button onClick={stopCamera} className="camera-btn cancel"><X size={20} /></button>
            <button onClick={capturePhoto} className="camera-btn capture"><Check size={28} /></button>
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="scanner-box">
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Prescription" className="preview-img" />
                <label htmlFor="file-upload" className="change-btn">
                  <ImageIcon size={16} /> Change Image
                </label>
              </div>
            ) : (
              <div className="upload-options">
                <label htmlFor="file-upload" className="upload-placeholder">
                  <div className="upload-icon-wrapper">
                    <UploadCloud size={32} color="#8B5CF6" />
                  </div>
                  <h3>Upload from Gallery</h3>
                  <p>JPG, PNG supported</p>
                </label>

                <div className="divider">OR</div>

                <button onClick={startCamera} className="upload-placeholder camera-option">
                  <div className="upload-icon-wrapper">
                    <Camera size={32} color="#10B981" />
                  </div>
                  <h3>Open Camera</h3>
                  <p>Scan prescription live</p>
                </button>
              </div>
            )}
            
            {/* Input ko 100% Hide karne ke liye display none aur height 0 */}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              id="file-upload" 
              style={{ display: 'none', opacity: 0, width: 0, height: 0, position: 'absolute' }} 
            />
          </div>

          {/* Button ko center aur full width karne ke liye style lagayi hai */}
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !image} 
            className="btn-glow"
            style={{ width: '100%', maxWidth: '300px', margin: '20px auto 0 auto', display: 'flex', justifyContent: 'center' }}
          >
            {loading ? "Scanning Data..." : "⚡ Run AI Analysis"}
          </button>
        </div>
      )}

      {errorMsg && <div className="error-alert">{errorMsg}</div>}
    </div>
  );
}

export default UploadBox;