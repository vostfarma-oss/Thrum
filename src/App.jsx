import { useState, useRef, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import { mockPosts } from './data/mockPosts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('popular');
  const [theme, setTheme] = useState('default');

  return (
    <div className="app" data-theme={theme}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} setTheme={setTheme} />
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
    </div>
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
  const [showReaction, setShowReaction] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const scrollAccum = useRef(0);
  const touchStartY = useRef(0);

  const shouldBlur = post.nsfw;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setClosing(true);
        setTimeout(() => { setExpanded(false); setClosing(false); }, 400);
      }
    }
  }, [isHovered]);

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -4 : 4;
    setStripeValue((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const deltaY = touchStartY.current - touch.clientY;
    const change = (deltaY / 200) * 100;
    setStripeValue((prev) => Math.max(0, Math.min(100, prev + change)));
    touchStartY.current = touch.clientY;
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleMainWheel = (e) => {
    if (!isHovered) return;
    if (e.target.closest('.stripe-vote')) return;
    e.preventDefault();
    e.stopPropagation();
    scrollAccum.current += e.deltaY;
    if (scrollAccum.current > 60 && !expanded) {
      setExpanded(true); scrollAccum.current = 0;
    }
    if (scrollAccum.current < -60 && expanded) {
      setClosing(true);
      setTimeout(() => { setExpanded(false); setClosing(false); }, 400);
      scrollAccum.current = 0;
    }
  };

  const handleTouchMainStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMainEnd = (e) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (deltaY > 40 && !expanded) setExpanded(true);
    if (deltaY < -40 && expanded) {
      setClosing(true);
      setTimeout(() => { setExpanded(false); setClosing(false); }, 400);
    }
  };

  const handlePostTap = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setClosing(true);
      setTimeout(() => { setExpanded(false); setClosing(false); }, 400);
    }
  };

  const currentReaction = STRIPE_REACTIONS.find(
    (r) => stripeValue >= r.range[0] && stripeValue < r.range[1]
  );

  const handleStripeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentReaction) {
      setShowReaction({ ...currentReaction, id: Date.now() });
      setTimeout(() => setShowReaction(null), 900);
    }
  };

  return (
    <article 
      className={`reddit-post ${post.nsfw ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''} ${closing ? 'closing' : ''}`}
      onMouseEnter={() => { setClosing(false); setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); }}
      onWheel={handleMainWheel}
      onTouchStart={handleTouchMainStart}
      onTouchEnd={handleTouchMainEnd}
      onClick={handlePostTap}
    >
      <div className={`card-stripe ${post.nsfw ? 'stripe-adult' : ''}`} />

      <div 
        className="stripe-vote" 
        onWheel={handleWheel} 
        onClick={handleStripeClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ '--stripe-value': `${stripeValue}%` }}
      >
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
          <div className="post-avatar">
            <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${post.author}`} alt="" className="avatar-img" />
          </div>
          <span className="post-community">r/{post.community}</span>
          <span className="post-dot">·</span>
          <span className="post-author">u/{post.author}</span>
          <span className="post-dot">·</span>
          <span className="post-time">4ч</span>
          {post.nsfw && <span className="nsfw-tag">NSFW</span>}
          {post.comments > 50 && <span className="hot-tag">🔥</span>}
        </div>

        <h3 className="post-title">{post.title}</h3>

        {post.preview && (
          <div className="post-preview">
            <img src={post.preview} alt="" className="preview-img" style={{ filter: shouldBlur ? 'blur(24px)' : 'none' }} />
            {shouldBlur && <div className="nsfw-blur-overlay"><span>🔞 Контент 18+</span></div>}
          </div>
        )}

        <div className="post-actions">
          <button className="action-btn"><span className="action-icon">💬</span><span>{post.comments}</span></button>
          <button className="action-btn"><span className="action-icon">🔗</span></button>
          <button className="action-btn"><span className="action-icon">🔖</span></button>
        </div>

        {!expanded && <span className="scroll-hint">↕ крути или тап</span>}
        {expanded && <span className="scroll-hint collapse-hint">↕ свернуть или тап</span>}

        {expanded && (
          <div className="expanded-area">
            {post.preview && (
              <div className="extra-gallery">
                <div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}a/300/200`} alt="" /></div>
                <div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}b/300/200`} alt="" /></div>
              </div>
            )}
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
    </article>
  );
}

export default App;