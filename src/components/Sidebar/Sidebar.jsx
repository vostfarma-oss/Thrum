import './Sidebar.css';

const communities = [
  { name: 'tech', members: '2.1k', active: true },
  { name: 'music', members: '890', active: true },
  { name: 'adult', members: '5.4k', active: true, nsfw: true },
  { name: 'gaming', members: '3.2k', active: false },
  { name: 'science', members: '1.7k', active: false },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <h3 className="sidebar-title">Сообщества</h3>
        <div className="community-list">
          {communities.map((c) => (
            <div key={c.name} className={`community-row ${c.nsfw ? 'nsfw' : ''}`}>
              <div className="community-left">
                <span className={`community-dot ${c.active ? 'active' : ''}`} />
                <span className="community-name">r/{c.name}</span>
                {c.nsfw && <span className="nsfw-badge">18+</span>}
              </div>
              <span className="community-members">{c.members}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Thrum Premium</h3>
        <p className="premium-desc">
          Доступ к 18+ контенту, AI-дайджест без лимитов, эксклюзивные реакции.
        </p>
        <button className="sidebar-premium-btn">
          <span>⚡</span> Попробовать
        </button>
      </div>

      <div className="sidebar-card">
        <h3 className="sidebar-title">Профиль</h3>
        <a href="/profile" className="profile-link">Мой профиль</a>
      </div>
    </aside>
  );
};

export default Sidebar;