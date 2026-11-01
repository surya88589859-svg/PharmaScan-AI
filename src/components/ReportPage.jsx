import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultCard from './ResultCard';
import { ArrowLeft, Activity } from 'lucide-react';

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Home page se bheja gaya data yahan receive karein
  const reportData = location.state?.reportData;

  // Agar koi direct /report par aaye bina data ke, toh usko wapas bhej dein
  if (!reportData) {
    return (
      <div className="app-container">
        <div className="empty-state">
          <h3>No Report Data Found</h3>
          <p>Please upload a prescription first.</p>
          <button onClick={() => navigate('/')} className="btn-glow" style={{marginTop: '20px'}}>
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Back Button aur Title */}
      <div className="report-header-nav">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} /> Upload New
        </button>
        <h1>Detailed Analysis Report</h1>
      </div>

      {/* Report Card Component */}
      <div className="report-container">
        <ResultCard result={reportData} />
      </div>
    </div>
  );
}

export default ReportPage;