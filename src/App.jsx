import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import PostPage from './pages/PostPage';
import { mockPosts } from './data/mockPosts';
import './App.css';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [activeTab, setActiveTab] = useState('popular');
  const [theme, setTheme] = useState('default');

  return (
    <BrowserRouter>
      <div className="app" data-theme={theme}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />
                <Routes>
          <Route path="/" element={
            <div className="app-layout">
              <main className="main-content">
                <div className="feed-tabs">
                  <button className={`feed-tab ${activeTab === 'popular' ? 'active' : ''}`} onClick={() => setActiveTab('popular')}>🔥 Популярное</button>
                  <button className={`feed-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>🆕 Новое</button>
                  <button className={`feed-tab ${activeTab === 'top' ? 'active' : ''}`} onClick={() => setActiveTab('top')}>🏆 Топ</button>
                </div>
                <div className="reddit-feed">
                  {mockPosts.map((post) => (
                    <RedditPost key={post.id} post={post} />
                  ))}
                </div>
              </main>
              <Sidebar />
            </div>
          } />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const STRIPE_REACTIONS = [
  { range: [0, 7], emoji: '🔥', label: 'Огонь', color: '#EF4444' },
  { range: [7, 14], emoji: '💎', label: 'Ценно', color: '#60A5FA' },
  { range: [14, 21], emoji: '🧠', label: 'Умно', color: '#22C55E' },
  { range: [21, 28], emoji: '💡', label: 'Идея', color: '#FBBF24' },
  { range: [28, 35], emoji: '👍', label: 'Лайк', color: '#94A3B8' },
  { range: [35, 42], emoji: '🤝', label: 'Уважение', color: '#818CF8' },
  { range: [42, 50], emoji: '👁️', label: 'Вижу', color: '#A78BFA' },
  { range: [50, 58], emoji: '🤔', label: 'Хм...', color: '#C084FC' },
  { range: [58, 66], emoji: '🤡', label: 'Клоун', color: '#F472B6' },
  { range: [66, 74], emoji: '💀', label: 'Кринж', color: '#9CA3AF' },
  { range: [74, 82], emoji: '⚠️', label: 'Спорно', color: '#F59E0B' },
  { range: [82, 90], emoji: '🚩', label: 'Тревога', color: '#EF4444' },
  { range: [90, 97], emoji: '👎', label: 'Дизлайк', color: '#DC2626' },
  { range: [97, 100], emoji: '💩', label: 'Дно', color: '#78716C' },
];

function RedditPost({ post }) {
  const [stripeValue, setStripeValue] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [showReaction, setShowReaction] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateStep, setGateStep] = useState(0);
  const [gateError, setGateError] = useState(false);
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const scrollAccum = useRef(0);
  const touchStartY = useRef(0);

  const shouldBlur = post.nsfw && !unlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setClosing(true);
        setTimeout(() => { setExpanded(false); setClosing(false); }, 250);
      }
    }
  }, [isHovered]);

  const handleWheel = (e) => {
    e.preventDefault(); e.stopPropagation();
    const delta = e.deltaY > 0 ? 4 : -4;
    setStripeValue((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); e.stopPropagation();
    const touch = e.touches[0];
    const deltaY = touchStartY.current - touch.clientY;
    const change = (deltaY / 200) * 100;
    setStripeValue((prev) => Math.max(0, Math.min(100, prev + change)));
    touchStartY.current = touch.clientY;
  };

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };

  const handleMainWheel = (e) => {
    if (!isHovered) return;
    if (e.target.closest('.stripe-vote')) return;
    e.preventDefault(); e.stopPropagation();
    scrollAccum.current += e.deltaY;
    if (scrollAccum.current > 60 && !expanded) { setExpanded(true); scrollAccum.current = 0; }
    if (scrollAccum.current < -60 && expanded) {
      setClosing(true);
      setTimeout(() => { setExpanded(false); setClosing(false); }, 250);
      scrollAccum.current = 0;
    }
  };

  const handleTouchMainStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMainEnd = (e) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (deltaY > 40 && !expanded) setExpanded(true);
    if (deltaY < -40 && expanded) { setClosing(true); setTimeout(() => { setExpanded(false); setClosing(false); }, 250); }
  };

  const handlePostTap = () => {
    if (!expanded) setExpanded(true);
    else { setClosing(true); setTimeout(() => { setExpanded(false); setClosing(false); }, 250); }
  };

  const currentReaction = STRIPE_REACTIONS.find(r => stripeValue >= r.range[0] && stripeValue < r.range[1]);

  const handleStripeClick = (e) => {
    e.stopPropagation(); e.preventDefault();
    if (currentReaction) { setShowReaction({ ...currentReaction, id: Date.now() }); setTimeout(() => setShowReaction(null), 900); }
  };

  const goToPost = (e) => { e.stopPropagation(); window.location.href = `/post/${post.id}`; };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (post.nsfw && !unlocked) {
      setShowGate(true); setGateStep(0); setGateError(false);
      setBirthDay(''); setBirthMonth(''); setBirthYear('');
    }
  };

  const checkAge = () => {
    const day = parseInt(birthDay);
    const month = parseInt(birthMonth);
    const year = parseInt(birthYear);
    if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2020) {
      setGateError(true); return;
    }
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age >= 18) { setGateStep(1); setGateError(false); }
    else { setGateError(true); }
  };

  const confirmAge = () => { setUnlocked(true); setShowGate(false); };

  const blurAmount = shouldBlur ? (hoverPreview ? '8px' : '22px') : 'none';

  return (
    <article className={`reddit-post ${post.nsfw ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''} ${closing ? 'closing' : ''}`}
      onMouseEnter={() => { setClosing(false); setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); setHoverPreview(false); }}
      onWheel={handleMainWheel}
      onTouchStart={handleTouchMainStart} onTouchEnd={handleTouchMainEnd}
      onClick={handlePostTap}>

      <div className={`card-stripe ${post.nsfw ? 'stripe-adult' : ''}`} />

      <div className="stripe-vote" onWheel={handleWheel} onClick={handleStripeClick}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
        style={{ '--stripe-value': `${stripeValue}%` }}>
        <div className="stripe-track">
          <div className="stripe-fill" style={{ height: `${stripeValue}%` }} />
          <div className="stripe-thumb">{currentReaction?.emoji}</div>
        </div>
        {currentReaction && (
          <div className="stripe-tooltip" style={{ '--stripe-value': `${stripeValue}%` }}>
            <span className="tooltip-emoji">{currentReaction.emoji}</span>
            <span className="tooltip-label">{currentReaction.label}</span>
          </div>
        )}
      </div>

      <div className="post-main" onClick={(e) => e.stopPropagation()}>
        <div className="post-header">
          <div className="post-avatar"><img src={`https://api.dicebear.com/9.x/initials/svg?seed=${post.author}`} alt="" className="avatar-img" /></div>
          <span className="post-community">r/{post.community}</span><span className="post-dot">·</span>
          <span className="post-author">u/{post.author}</span><span className="post-dot">·</span>
          <span className="post-time">4ч</span>
          {post.nsfw && <span className="nsfw-tag">NSFW</span>}
          {post.comments > 50 && <span className="hot-tag">🔥</span>}
        </div>

        <h3 className="post-title" onClick={goToPost}>{post.title}</h3>

        {post.preview && (
          <div className="post-preview" onMouseEnter={() => setHoverPreview(true)} onMouseLeave={() => setHoverPreview(false)} onClick={handlePreviewClick}>
            <img src={post.preview} alt="" className="preview-img" style={{ filter: `blur(${blurAmount})`, transform: hoverPreview && shouldBlur ? 'scale(1.04)' : 'scale(1)' }} />
            {shouldBlur && <div className="nsfw-blur-overlay"><span>🔞 Контент 18+</span><span className="nsfw-sub">Нажмите для просмотра</span></div>}
          </div>
        )}

        <div className="post-actions">
          <button className="action-btn" onClick={goToPost}><span className="action-icon">💬</span><span>{post.comments}</span></button>
          <button className="action-btn"><span className="action-icon">🔗</span></button>
          <button className="action-btn"><span className="action-icon">🔖</span></button>
        </div>

        {!expanded && <span className="scroll-hint">↕ крути или тап</span>}
        {expanded && <span className="scroll-hint collapse-hint">↕ свернуть или тап</span>}

        {expanded && (
          <div className="expanded-area">
            {post.preview && <div className="extra-gallery"><div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}a/300/200`} alt="" /></div><div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}b/300/200`} alt="" /></div></div>}
            <div className="expanded-body">
              <p className="full-text">Здесь будет полный текст поста. Обсуждение набирает обороты.</p>
              <div className="preview-comments">
                <div className="preview-comment"><span className="pc-author">@user123</span><span className="pc-text">Полностью согласен!</span></div>
                <div className="preview-comment"><span className="pc-author">@dev_guy</span><span className="pc-text">Не могу понять хайп...</span></div>
                <div className="preview-comment"><span className="pc-author">@thinker</span><span className="pc-text">Смотрите глубже.</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showReaction && (
        <div className="reaction-pop" style={{ '--pop-color': showReaction.color }}>
          <span className="pop-emoji">{showReaction.emoji}</span>
          <span className="pop-label">{showReaction.label}</span>
        </div>
      )}

      {showGate && (
        <div className="age-gate-overlay" onClick={() => setShowGate(false)}>
          <div className="age-gate" onClick={(e) => e.stopPropagation()}>
            {gateStep === 0 ? (
              <>
                <span className="age-gate-icon">🔞</span>
                <h3>Подтвердите возраст</h3>
                <p className="age-gate-desc">Введите вашу дату рождения:</p>
                <div className="date-inputs">
                  <input className="date-inp" type="text" placeholder="ДД" maxLength={2} value={birthDay} onChange={(e) => setBirthDay(e.target.value.replace(/\D/g,''))} />
                  <input className="date-inp" type="text" placeholder="ММ" maxLength={2} value={birthMonth} onChange={(e) => setBirthMonth(e.target.value.replace(/\D/g,''))} />
                  <input className="date-inp year" type="text" placeholder="ГГГГ" maxLength={4} value={birthYear} onChange={(e) => setBirthYear(e.target.value.replace(/\D/g,''))} />
                </div>
                {gateError && <span className="age-gate-error">Вам должно быть 18 лет или больше</span>}
                <button className="age-gate-btn" onClick={checkAge}>Подтвердить</button>
                <button className="age-gate-cancel" onClick={() => setShowGate(false)}>Отмена</button>
              </>
            ) : (
              <>
                <span className="age-gate-icon">✅</span>
                <h3>Доступ разрешён</h3>
                <p className="age-gate-desc">Вы подтвердили, что вам есть 18 лет. Контент будет разблокирован.</p>
                <button className="age-gate-btn" onClick={confirmAge}>Продолжить</button>
                <button className="age-gate-cancel" onClick={() => setShowGate(false)}>Отмена</button>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default App;