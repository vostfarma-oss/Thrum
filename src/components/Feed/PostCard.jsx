import { useState, useRef, useEffect } from 'react';
import './PostCard.css';

const REACTIONS = [
  { main: '🔥', related: ['❤️‍🔥', '💥', '🎆'], label: 'Огонь', count: 142, color: '#EF4444', effect: 'fire' },
  { main: '💎', related: ['🏆', '✨', '👑'], label: 'Ценно', count: 89, color: '#60A5FA', effect: 'diamond' },
  { main: '🧠', related: ['🤔', '📚', '💡'], label: 'Умно', count: 56, color: '#22C55E', effect: 'brain' },
  { main: '🤡', related: ['😂', '💀', '🤪'], label: 'Смешно', count: 34, color: '#FACC15', effect: 'clown' },
  { main: '🚩', related: ['⚠️', '🤨', '👎'], label: 'Спорно', count: 12, color: '#F97316', effect: 'flag' },
];

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [flyEmojis, setFlyEmojis] = useState([]);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const scrollAccum = useRef(0);
  const hideTimer = useRef(null);
  const cardRef = useRef(null);

  const shouldBlur = post.nsfw && !isUnlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setAnimatingOut(true);
        setTimeout(() => {
          setExpanded(false);
          setAnimatingOut(false);
        }, 500);
      }
      setActiveReaction(null);
    }
  }, [isHovered]);

  const handleWheel = (e) => {
    if (!isHovered || expanded) return;
    e.preventDefault();
    scrollAccum.current += e.deltaY;
    if (scrollAccum.current > 50) {
      setExpanded(true);
      scrollAccum.current = 0;
      setActiveReaction(null);
    }
  };

  const handleReactionEnter = (emoji) => {
    clearTimeout(hideTimer.current);
    setActiveReaction(emoji);
  };

  const handleReactionLeave = () => {
    hideTimer.current = setTimeout(() => setActiveReaction(null), 450);
  };

  const handleReactionClick = (emoji, effect, e) => {
    e.stopPropagation();
    const rect = cardRef.current.getBoundingClientRect();
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;
    const id = Date.now();
    const newFlies = [];
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const dist = 20 + Math.random() * 45;
      let x = Math.cos(angle) * dist;
      let y = Math.sin(angle) * dist - 10;
      let size = 10 + Math.random() * 16;
      let rot = (Math.random() - 0.5) * 40;
      let em = emoji;

      if (effect === 'fire') {
        y -= 10 + Math.random() * 25;
        size = 8 + Math.random() * 22;
        rot = (Math.random() - 0.5) * 60;
      }
      if (effect === 'diamond') {
        em = i < 3 ? '💎' : '💠';
        x *= 0.7; y *= 0.7;
        size = 10 + Math.random() * 12;
      }
      if (effect === 'brain') {
        y = -10 - i * 7;
        x = (i - count / 2) * 12;
        size = 14 - i * 1.5;
        rot = 0;
      }
      if (effect === 'clown') {
        x = (Math.random() - 0.5) * 70;
        y = -5 - Math.random() * 50;
        size = 12 + Math.random() * 18;
        rot = (Math.random() - 0.5) * 50;
      }
      if (effect === 'flag') {
        x = (i % 2 === 0 ? -1 : 1) * (18 + Math.random() * 35);
        y = -8 - i * 6;
        size = 14 - i * 2;
        rot = (i % 2 === 0 ? -10 : 10);
      }

      newFlies.push({ id: id + i, emoji: em, x, y, size, rot, ox, oy, delay: i * 0.025 });
    }

    setFlyEmojis((p) => [...p, ...newFlies]);
    setTimeout(() => setFlyEmojis((p) => p.filter((f) => !newFlies.includes(f))), 850);
  };

  const handleClick = () => {
    if (post.nsfw && !isUnlocked) {
      alert('Возрастной гейт — будет позже');
      return;
    }
  };

  const blurAmount = shouldBlur ? (hoverPreview ? '8px' : '24px') : 'none';
  const blurScale = shouldBlur && hoverPreview ? 'scale(1.06)' : 'scale(1)';
  const activeData = REACTIONS.find((r) => r.main === activeReaction);

  return (
    <article
      ref={cardRef}
      className={`post-card ${shouldBlur ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''} ${animatingOut ? 'collapsing' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); handleReactionLeave(); setHoverPreview(false); }}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      <div className={`card-stripe ${post.nsfw ? 'stripe-adult' : ''}`} />

      <div className="card-top">
        <div className="card-preview" onMouseEnter={() => setHoverPreview(true)} onMouseLeave={() => setHoverPreview(false)}>
          {post.preview ? (
            <>
              <img src={post.preview} alt="" className="preview-img" style={{ filter: `blur(${blurAmount})`, transform: blurScale }} />
              {shouldBlur && (<div className="nsfw-overlay"><span className="nsfw-icon">🔞</span></div>)}
            </>
          ) : (
            <div className="card-preview-empty"><span className="empty-icon">{post.nsfw ? '🔞' : '💬'}</span></div>
          )}
        </div>

        <div className="card-body">
          <div className="card-meta">
            <span className={`meta-community ${post.nsfw ? 'adult' : ''}`}>r/{post.community}</span>
            <span className="meta-sep">·</span>
            <span className="meta-author">@{post.author}</span>
            <span className="meta-sep">·</span>
            <span className="meta-time">4ч</span>
            {post.comments > 50 && <span className="hot-badge">🔥 горячо</span>}
          </div>
          <h3 className="card-title">{post.title}</h3>
          {isHovered && !expanded && <span className="scroll-hint">↕ крути чтобы раскрыть</span>}
        </div>

        {!expanded && (
          <div className={`reaction-panel ${isHovered ? 'on' : ''}`}>
            {REACTIONS.map(({ main, count, label, effect }) => (
              <button key={main} className={`reaction-pill ${activeReaction === main ? 'active' : ''}`}
                onMouseEnter={() => handleReactionEnter(main)} onMouseLeave={handleReactionLeave}
                onClick={(e) => handleReactionClick(main, effect, e)} title={label}>
                <span className="rp-emoji">{main}</span>
                <span className="rp-count">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!expanded && (
        <div className={`related-row ${activeData ? 'show' : ''}`}
          onMouseEnter={() => clearTimeout(hideTimer.current)} onMouseLeave={handleReactionLeave}>
          {activeData?.related.map((sub, i) => (
            <button key={sub} className="rel-btn" style={{ animationDelay: `${i * 0.04}s` }}
              onClick={(e) => handleReactionClick(sub, 'clown', e)}>{sub}</button>
          ))}
        </div>
      )}

      {expanded && (
        <div className="expanded-area">
          {post.preview && (
            <div className="extra-gallery">
              <div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}a/300/200`} alt="" /></div>
              <div className="gallery-item"><img src={`https://picsum.photos/seed/${post.id}b/300/200`} alt="" /></div>
            </div>
          )}
          <div className="expanded-body">
            <p className="full-text">Здесь будет полный текст поста. Пользователи обсуждают эту тему очень активно, делятся опытом и спорят до хрипоты. Мнения разделились на два лагеря.</p>
            <div className="preview-comments">
              <div className="preview-comment"><span className="pc-author">@user123</span><span className="pc-text">Полностью согласен, так и есть!</span></div>
              <div className="preview-comment"><span className="pc-author">@dev_guy</span><span className="pc-text">Не могу понять хайп, обычная тема...</span></div>
              <div className="preview-comment"><span className="pc-author">@thinker</span><span className="pc-text">Смотрите глубже, тут важен контекст.</span></div>
            </div>
          </div>
          <div className="expanded-reactions">
            {REACTIONS.map(({ main, count, label, effect }, i) => (
              <button key={main} className="exp-reaction" style={{ animationDelay: `${0.5 + i * 0.06}s` }}
                onClick={(e) => handleReactionClick(main, effect, e)} title={label}>
                <span className="exp-emoji">{main}</span>
                <span className="exp-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {flyEmojis.map((f) => (
        <span key={f.id} className="fly-particle" style={{
          '--x': `${f.x}px`, '--y': `${f.y}px`, '--s': `${f.size}px`,
          '--r': `${f.rot}deg`, '--ox': `${f.ox}px`, '--oy': `${f.oy}px`,
          animationDelay: `${f.delay}s`,
        }}>{f.emoji}</span>
      ))}

      <div className="shine-border" />
    </article>
  );
};

export default PostCard;