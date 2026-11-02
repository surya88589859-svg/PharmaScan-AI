import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, ArrowRight, Code, User, Users, HeartPulse } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  // Team Members ka Data (Madhuri added)
  const teamMembers = [
    { name: "Irfan", role: "Lead Dev", icon: <Code size={20} color="#8B5CF6" /> },
    { name: "Kapil Singh", role: "Backend", icon: <Activity size={20} color="#3B82F6" /> },
    { name: "Arman Ali", role: "UI/UX", icon: <User size={20} color="#10B981" /> },
    { name: "Madhuri Singh", role: "Research", icon: <HeartPulse size={20} color="#EC4899" /> }
  ];

  return (
    <div className="app-container home-container no-scroll-page">
      {/* Hero Section */}
      <div className="hero-section compact-hero">
        <div className="badge-top">
          <Zap size={14} /> AI-Powered Healthcare
        </div>
        
        <h1 className="hero-title">
          PharmaScan <span className="gradient-text">AI</span>
        </h1>
        
        <p className="hero-subtitle">
          Instantly analyze handwritten prescriptions, detect drug interactions, and get safety warnings.
        </p>

        <div className="hero-actions">
          <button onClick={() => navigate('/scan')} className="btn-glow hero-btn">
            Start Analysis <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Team Section (Compact Grid) */}
      <div className="team-section compact-team">
        <div className="team-header">
          <Users size={20} color="#A78BFA" />
          <h2>Meet The Team</h2>
        </div>
        
        <div className="team-grid compact-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card glass-panel">
              <div className="dev-avatar-small">
                {member.icon}
              </div>
              <div className="dev-info-small">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid (Compact) */}
      <div className="features-grid compact-features">
        <div className="feature-box-small glass-panel">
          <Activity size={20} color="#3B82F6" />
          <h4>Smart OCR</h4>
        </div>
        <div className="feature-box-small glass-panel">
          <ShieldCheck size={20} color="#10B981" />
          <h4>FDA Verified</h4>
        </div>
        <div className="feature-box-small glass-panel">
          <Zap size={20} color="#F59E0B" />
          <h4>Instant Alerts</h4>
        </div>
      </div>
    </div>
  );
}

export default HomePage;