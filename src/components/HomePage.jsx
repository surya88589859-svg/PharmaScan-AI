import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, ArrowRight, Code, User, Users } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  // Team Members ka Data
  const teamMembers = [
    { name: "Irfan", role: "Lead Developer", icon: <Code size={24} color="#8B5CF6" /> },
    { name: "Kapil Singh", role: "AI & Backend", icon: <Activity size={24} color="#3B82F6" /> },
    { name: "Arman Ali", role: "UI/UX Designer", icon: <User size={24} color="#10B981" /> }
  ];

  return (
    <div className="app-container home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="badge-top">
          <Zap size={14} /> AI-Powered Healthcare Solution
        </div>
        
        <h1 className="hero-title">
          Welcome to <span className="gradient-text">PharmaScan AI</span>
        </h1>
        
        <p className="hero-subtitle">
          Instantly analyze handwritten prescriptions, detect dangerous drug-drug interactions, 
          and get personalized food & diet warnings using advanced AI.
        </p>

        <div className="hero-actions">
          <button onClick={() => navigate('/scan')} className="btn-glow hero-btn">
            Start Analysis <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <div className="team-header">
          <Users size={24} color="#A78BFA" />
          <h2>Meet The Team</h2>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card glass-panel">
              <div className="dev-avatar">
                {member.icon}
              </div>
              <div className="dev-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-box glass-panel">
          <Activity size={28} color="#3B82F6" />
          <h4>Smart OCR</h4>
          <p>Reads complex handwritten prescriptions with high accuracy.</p>
        </div>
        <div className="feature-box glass-panel">
          <ShieldCheck size={28} color="#10B981" />
          <h4>FDA Verified</h4>
          <p>Cross-checks interactions against official OpenFDA databases.</p>
        </div>
        <div className="feature-box glass-panel">
          <Zap size={28} color="#F59E0B" />
          <h4>Instant Alerts</h4>
          <p>Get immediate Red/Yellow/Green risk warnings for safety.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;