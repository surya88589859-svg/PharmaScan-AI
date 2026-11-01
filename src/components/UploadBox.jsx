import React from 'react';
import { UploadCloud, Image as ImageIcon, X, FileText } from 'lucide-react';

function UploadBox({ image, preview, handleImageUpload, handleAnalyze, loading, errorMsg }) {
  const removeImage = () => {
    window.location.reload(); // Simple reload to clear state (for now)
  };

  return (
    <div className="upload-section glass-panel">
      <div className="section-header">
        <h2>Upload Prescription</h2>
        <span className="step-badge">Step 1</span>
      </div>
      
      <div className={`scanner-box ${preview ? 'has-preview' : ''}`}>
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Prescription" className="preview-img" />
            <label htmlFor="file-upload" className="change-btn">
              <ImageIcon size={16} /> Change Image
            </label>
          </div>
        ) : (
          <label htmlFor="file-upload" className="upload-placeholder">
            <div className="upload-icon-wrapper">
              <UploadCloud size={32} color="#8B5CF6" />
            </div>
            <h3>Drag & Drop or Click</h3>
            <p>Upload a clear photo of your prescription</p>
            <div className="file-types">
              <span><FileText size={12} /> JPG</span>
              <span><FileText size={12} /> PNG</span>
            </div>
          </label>
        )}
        
        <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" id="file-upload" />
      </div>

      <button onClick={handleAnalyze} disabled={loading || !image} className="btn-glow">
        {loading ? (
          <span className="btn-loading"><div className="spinner-small"></div> Scanning Data...</span>
        ) : (
          <><ActivityIcon /> Run AI Analysis</>
        )}
      </button>

      {errorMsg && <div className="error-alert">{errorMsg}</div>}
    </div>
  );
}

// Chhota sa custom icon component
const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default UploadBox;