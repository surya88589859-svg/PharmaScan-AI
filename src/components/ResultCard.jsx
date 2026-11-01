import React from 'react';
import { AlertTriangle, CheckCircle, Info, Ban, Apple, HeartPulse, ShieldAlert } from 'lucide-react';

function ResultCard({ result }) {
  if (!result) return null;

  const getStatusDisplay = () => {
    if (result.status === 'high') return { icon: <ShieldAlert size={28} />, text: 'High Risk Detected', class: 'danger' };
    if (result.status === 'moderate') return { icon: <Info size={28} />, text: 'Moderate Risk', class: 'warning' };
    return { icon: <CheckCircle size={28} />, text: 'Safe to Consume', class: 'success' };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="result-card fade-in">
      
      <div className={`status-banner ${statusDisplay.class}`}>
        <div className="status-icon-wrapper">{statusDisplay.icon}</div>
        <div>
          <h3>{statusDisplay.text}</h3>
          <p>Based on AI & FDA Database analysis</p>
        </div>
      </div>

      <div className="card-section">
        <h4><CheckCircle size={18} className="text-blue" /> Identified Medicines</h4>
        <div className="med-pills">
          {result.medicines.map((med, i) => (
            <span key={i} className="med-pill">{med}</span>
          ))}
        </div>
      </div>

      <div className="card-section">
        <h4><AlertTriangle size={18} className="text-red" /> Drug Interactions</h4>
        {result.drugInteractions.map((int, i) => (
          <div key={i} className="interaction-alert">
            <AlertTriangle size={16} /> {int}
          </div>
        ))}
      </div>

      <div className="info-grid">
        <div className="info-box avoid">
          <div className="info-header">
            <Ban size={18} /> <h4>Foods to Avoid</h4>
          </div>
          <ul>
            {result.avoidList.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="info-box diet">
          <div className="info-header">
            <Apple size={18} /> <h4>Diet Tips</h4>
          </div>
          <ul>
            {result.dietList.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="info-box side-effects">
          <div className="info-header">
            <HeartPulse size={18} /> <h4>Side Effects</h4>
          </div>
          <ul>
            {result.sideEffectsList.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="card-disclaimer">
        <Info size={14} /> 
        <p>Medical Disclaimer: This AI analysis is for informational purposes only. Always consult a qualified doctor.</p>
      </div>

    </div>
  );
}

export default ResultCard;