import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const RARITIES = [
  { name: 'Пыль', color: '#94A3B8', glow: 'none', chance: 50, icon: '💨' },
  { name: 'Искра', color: '#FBBF24', glow: '0 0 8px #FBBF24', chance: 25, icon: '⚡' },
  { name: 'Пламя', color: '#F97316', glow: '0 0 16px #F97316', chance: 13, icon: '🔥' },
  { name: 'Бездна', color: '#A78BFA', glow: '0 0 20px #A78BFA', chance: 7, icon: '🌑' },
  { name: 'Хаос', color: '#EC4899', glow: '0 0 24px #EC4899', chance: 3.5, icon: '🌀' },
  { name: 'Космос', color: '#6366F1', glow: '0 0 32px #6366F1, 0 0 64px #818CF8', chance: 1.5, icon: '✨' },
];

const ARTIFACT_SHAPES = ['◆', '●', '▲', '⬟', '⬢', '◈', '✧', '⬒'];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('collection');
  const [mining, setMining] = useState(false);
  const [taps, setTaps] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [newArtifact, setNewArtifact] = useState(null);
  const [blockCracks, setBlockCracks] = useState(0);
  const tapRef = useRef(null);

  const [user] = useState({
    name: 'dev_guy',
    displayName: 'Dev Guy',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=dev_guy',
    premium: true,
    title: 'Искра Во тьме',
    karma: 2847,
    joined: 'январь 2025',
    blocksBroken: 12,
    bestTapStreak: 87,
    bio: 'Веб-разработчик. Коллекционирую артефакты.',
  });

  const [artifacts, setArtifacts] = useState([
    { id: 1, name: 'Уголёк', rarity: 'Пыль', shape: '◆', color: '#94A3B8', date: '12.01.2025' },
    { id: 2, name: 'Всполох', rarity: 'Искра', shape: '●', color: '#FBBF24', date: '03.02.2025', inShowcase: true },
    { id: 3, name: 'Пекло', rarity: 'Пламя', shape: '▲', color: '#F97316', date: '18.03.2025', inShowcase: true },
    { id: 4, name: 'Шёпот', rarity: 'Бездна', shape: '◈', color: '#A78BFA', date: '01.04.2025', inShowcase: true },
  ]);

  const [showcase, setShowcase] = useState(artifacts.filter(a => a.inShowcase));
  const [auctionLots] = useState([
    { id: 1, name: 'Звездопад', rarity: 'Пламя', seller: 'tech_guru', bid: 340, shape: '✧' },
    { id: 2, name: 'Червоточина', rarity: 'Бездна', seller: 'night_owl', bid: 890, shape: '⬟' },
    { id: 3, name: 'Осколок', rarity: 'Хаос', seller: 'mystery_user', bid: 2400, shape: '⬒' },
  ]);

  const getRarity = () => {
    const roll = Math.random() * 100;
    let cumulative = 0;
    for (const r of RARITIES) {
      cumulative += r.chance;
      if (roll <= cumulative) return r;
    }
    return RARITIES[0];
  };

  const startMining = () => {
    setMining(true);
    setTaps(0);
    setBlockCracks(0);
    setShowResult(false);
  };

  const handleTap = () => {
    if (!mining || showResult) return;
    const newTaps = taps + 1;
    setTaps(newTaps);
    setBlockCracks(Math.floor(newTaps / 10));
    if (newTaps >= 30) {
      // Определяем редкость с бонусом от тапов
      const bonus = Math.min(newTaps - 30, 50); // максимум +50% к шансу редкости
      const roll = Math.random() * 100 - bonus * 0.3;
      let cumulative = 0;
      let rarity = RARITIES[0];
      for (const r of RARITIES) {
        cumulative += r.chance;
        if (roll <= cumulative) { rarity = r; break; }
      }
      const shape = ARTIFACT_SHAPES[Math.floor(Math.random() * ARTIFACT_SHAPES.length)];
      const names = {
        'Пыль': ['Осколок', 'Крошка', 'Песчинка', 'Уголёк'],
        'Искра': ['Всполох', 'Зарница', 'Молния', 'Разряд'],
        'Пламя': ['Пекло', 'Геенна', 'Феникс', 'Жар'],
        'Бездна': ['Шёпот', 'Глубина', 'Пустота', 'Тьма'],
        'Хаос': ['Энтропия', 'Вихрь', 'Разлом', 'Анархия'],
        'Космос': ['Сверхновая', 'Туманность', 'Квазар', 'Сингулярность'],
      };
      const name = names[rarity.name][Math.floor(Math.random() * 4)];
      const artifact = {
        id: Date.now(),
        name,
        rarity: rarity.name,
        shape,
        color: rarity.color,
        date: new Date().toLocaleDateString('ru'),
      };
      setNewArtifact(artifact);
      setShowResult(true);
      setMining(false);
      setArtifacts([...artifacts, artifact]);
    }
  };

  const frameStyle = () => {
    if (!showcase.length) return '1px solid var(--border)';
    const rarest = showcase.reduce((max, a) => {
      const ri = RARITIES.findIndex(r => r.name === a.rarity);
      const mi = RARITIES.findIndex(r => r.name === max.rarity);
      return ri > mi ? a : max;
    }, showcase[0]);
    const r = RARITIES.find(r => r.name === rarest.rarity);
    return {
      border: `2px solid ${r.color}`,
      boxShadow: r.glow,
      borderRadius: '16px',
    };
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>

      {/* Шапка профиля с рамкой */}
      <div className="profile-header" style={frameStyle()}>
        <div className="profile-avatar-wrap">
          <img src={user.avatar} alt="" className="profile-avatar" />
          {user.premium && <span className="premium-badge">⚡</span>}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.displayName}</h1>
          <span className="profile-username">@{user.name}</span>
          <span className="profile-title" style={{ color: RARITIES.find(r => r.name === (showcase[0]?.rarity || 'Пыль'))?.color }}>
            {user.title}
          </span>
          <p className="profile-bio">{user.bio}</p>
          <div className="profile-stats">
            <div className="stat-item"><span className="stat-value">{user.karma}</span><span className="stat-label">Карма</span></div>
            <div className="stat-item"><span className="stat-value">{user.blocksBroken}</span><span className="stat-label">Глыб</span></div>
            <div className="stat-item"><span className="stat-value">{artifacts.length}</span><span className="stat-label">Артефактов</span></div>
            <div className="stat-item"><span className="stat-value">{user.bestTapStreak}</span><span className="stat-label">Рекорд</span></div>
          </div>
        </div>
      </div>

      {/* Кнопка добычи */}
      <button className="mine-btn" onClick={startMining} disabled={mining}>
        <span className="mine-icon">⛏️</span> Разбить глыбу
      </button>

      {/* Экран добычи */}
      {mining && (
        <div className="mining-overlay" onClick={handleTap}>
          <div className="mining-block">
            <div className="block-cracks" style={{ opacity: blockCracks * 0.3 }}>
              {[...Array(Math.min(blockCracks, 8))].map((_, i) => (
                <span key={i} className="crack" style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}>⚡</span>
              ))}
            </div>
            <span className="block-emoji">🟩</span>
            <p className="block-label">Тапай! {taps}/30</p>
            <div className="block-progress">
              <div className="block-progress-fill" style={{ width: `${Math.min((taps / 30) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Результат добычи */}
      {showResult && newArtifact && (
        <div className="result-overlay" onClick={() => setShowResult(false)}>
          <div className="result-card" onClick={e => e.stopPropagation()}>
            <span className="result-rarity" style={{ color: newArtifact.color }}>{newArtifact.rarity}</span>
            <span className="result-shape" style={{ color: newArtifact.color, textShadow: RARITIES.find(r => r.name === newArtifact.rarity)?.glow }}>
              {newArtifact.shape}
            </span>
            <h2 className="result-name">{newArtifact.name}</h2>
            <button className="result-btn" onClick={() => setShowResult(false)}>Забрать</button>
          </div>
        </div>
      )}

      {/* Табы */}
      <div className="profile-tabs">
        <button className={`prof-tab ${activeTab === 'collection' ? 'active' : ''}`} onClick={() => setActiveTab('collection')}>Коллекция</button>
        <button className={`prof-tab ${activeTab === 'showcase' ? 'active' : ''}`} onClick={() => setActiveTab('showcase')}>Витрина</button>
        <button className={`prof-tab ${activeTab === 'auction' ? 'active' : ''}`} onClick={() => setActiveTab('auction')}>Аукцион</button>
      </div>

      {/* Коллекция */}
      {activeTab === 'collection' && (
        <div className="artifacts-grid">
          {artifacts.map(a => (
            <div key={a.id} className="artifact-card" style={{ borderColor: a.color, boxShadow: RARITIES.find(r => r.name === a.rarity)?.glow }}>
              <span className="artifact-shape" style={{ color: a.color }}>{a.shape}</span>
              <span className="artifact-name">{a.name}</span>
              <span className="artifact-rarity" style={{ color: a.color }}>{a.rarity}</span>
              <span className="artifact-date">{a.date}</span>
            </div>
          ))}
          {[...Array(6 - artifacts.length)].map((_, i) => (
            <div key={`empty-${i}`} className="artifact-card empty">
              <span className="artifact-shape">?</span>
              <span className="artifact-name">Пусто</span>
            </div>
          ))}
        </div>
      )}

      {/* Витрина */}
      {activeTab === 'showcase' && (
        <div className="showcase-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="showcase-slot">
              {showcase[i] ? (
                <div className="showcase-artifact" style={{ borderColor: showcase[i].color, boxShadow: RARITIES.find(r => r.name === showcase[i].rarity)?.glow }}>
                  <span className="artifact-shape" style={{ color: showcase[i].color }}>{showcase[i].shape}</span>
                  <span className="artifact-name">{showcase[i].name}</span>
                </div>
              ) : (
                <div className="showcase-slot-empty">
                  <span>Выбрать артефакт</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Аукцион */}
      {activeTab === 'auction' && (
        <div className="auction-list">
          {auctionLots.map(lot => (
            <div key={lot.id} className="auction-card">
              <div className="auction-artifact">
                <span className="auction-shape" style={{ color: RARITIES.find(r => r.name === lot.rarity)?.color }}>{lot.shape}</span>
                <div className="auction-info">
                  <span className="auction-name">{lot.name}</span>
                  <span className="auction-rarity" style={{ color: RARITIES.find(r => r.name === lot.rarity)?.color }}>{lot.rarity}</span>
                  <span className="auction-seller">от @{lot.seller}</span>
                </div>
              </div>
              <div className="auction-bid">
                <span className="bid-amount">{lot.bid} TC</span>
                <button className="bid-btn">Ставка</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;