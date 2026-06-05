import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';

const Header = () => {
  const { theme, switchTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('feed');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'adult') {
      switchTheme('adult');
    } else {
      switchTheme('default');
    }
  };

  return (
    <header className="header">
      <div className="header-gradient" />

      <div className="header-content">
        <div className="logo">
          <span className="logo-text">Thrum</span>
          <span className="logo-dot">•</span>
        </div>

        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => handleTabClick('feed')}
          >
            Лента
          </button>
          <button
            className={`nav-btn ${activeTab === 'adult' ? 'active adult-active' : ''}`}
            onClick={() => handleTabClick('adult')}
          >
            18+
          </button>
        </nav>

        <div className="header-right">
          <button className="premium-btn">
            <span className="premium-icon">⚡</span>
            Premium
          </button>
          <div className="avatar">
            <div className="avatar-placeholder" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;