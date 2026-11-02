import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { extractTextFromImage } from './services/ocrService';
import { analyzeMedicines } from './services/drugApi';
import UploadBox from './components/UploadBox';
import ReportPage from './components/ReportPage';
import HomePage from './components/HomePage';
import { Activity, ShieldCheck } from 'lucide-react';
import './App.css';

// --- SCANNER PAGE COMPONENT ---
function ScanPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate(); 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Pehle prescription ki photo upload karein!");
    setLoading(true);
    setErrorMsg('');
    
    try {
      const extractedText = await extractTextFromImage(image);
      
      if (!extractedText || extractedText.trim() === '') {
        throw new Error("Image se koi text nahi mila. Kripya clear photo try karein.");
      }
      
      const analysisResult = await analyzeMedicines(extractedText);

      // AGAR DRUG API NE ERROR DIYA HAI (GALAT PHOTO PAR)
      if (analysisResult.status === "error") {
        throw new Error(analysisResult.medicines[0] || "Koi valid dawai nahi mili.");
      }

      // Sab theek hone par report page par bhejein
      navigate('/report', { state: { reportData: analysisResult } });

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message || "Photo padhne mein problem aayi. Kripya sahi prescription daalein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: '800' }}>Scan Prescription</h1>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '5px' }}>Upload a clear photo of your prescription to get instant medical insights.</p>
      </header>

      <div className="single-column">
        <UploadBox 
          image={image} preview={preview} handleImageUpload={handleImageUpload} 
          handleAnalyze={handleAnalyze} loading={loading} errorMsg={errorMsg} 
        />
      </div>
    </div>
  );
}


// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="glow-bg glow-1"></div>
        <div className="glow-bg glow-2"></div>

        <nav className="navbar">
          <div className="logo" onClick={() => window.location.href = '/'} style={{cursor: 'pointer'}}>
            <Activity color="#8B5CF6" size={28} />
            <span>PharmaScan <span className="ai-tag">AI</span></span>
          </div>
          <div className="nav-badge">
            <ShieldCheck size={16} /> Secure Analysis
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;