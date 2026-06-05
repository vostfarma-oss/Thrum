import { useState, useRef, useEffect } from 'react';
import './PostCard.css';

const REACTIONS = [
  { main: '🔥', related: ['❤️‍🔥', '💥'], label: 'Огонь', count: 142 },
  { main: '💎', related: ['🏆', '👑'], label: 'Ценно', count: 89 },
  { main: '🧠', related: ['💡', '📚'], label: 'Умно', count: 56 },
  { main: '🤡', related: ['😂', '💀'], label: 'Смешно', count: 34 },
  { main: '🚩', related: ['⚠️', '👎'], label: 'Спорно', count: 12 },
];

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [flyEmojis, setFlyEmojis] = useState([]);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const scrollAccum = useRef(0);
  const cardRef = useRef(null);

  const shouldBlur = post.nsfw && !isUnlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setClosing(true);
        setTimeout(() => {
          setExpanded(false);
          setClosing(false);
        }, 350);
      }
    }
  }, [isHovered]);

  const handleWheel = (e) => {
    if (!isHovered || expanded) return;
    e.preventDefault();
    scrollAccum.current += e.deltaY;
    if (scrollAccum.current > 40) {
      setExpanded(true);
      scrollAccum.current = 0;
    }
  };

  const handleReactionClick = (emoji, e) => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const card = cardRef.current;
    const btnRect = btn.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const ox = btnRect.left + btnRect.width / 2 - cardRect.left;
    const oy = btnRect.top + btnRect.height / 2 - cardRect.top;

    const id = Date.now();
    const flies = [];
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      flies.push({ id: id + i, emoji, size: 10 + i * 5, delay: i * 0.04, ox, oy });
    }
    setFlyEmojis((prev) => [...prev, ...flies]);
    setTimeout(() => setFlyEmojis((prev) => prev.filter((f) => !flies.includes(f))), 600);
  };

  const handleClick = () => {
    if (post.nsfw && !isUnlocked) alert('Гейт — позже');
  };

  const blurAmount = shouldBlur ? (hoverPreview ? '5px' : '20px') : 'none';
  const blurScale = shouldBlur && hoverPreview ? 'scale(1.08)' : 'scale(1)';

  return (
    <article
      ref={cardRef}
      className={`post-card ${shouldBlur ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''} ${closing ? 'closing' : ''}`}
      onMouseEnter={() => { setClosing(false); setIsHovered(true); }}
      onMouseLeave={() => { setIsHovered(false); setHoverPreview(false); }}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      <div className={`card-stripe ${post.nsfw ? 'stripe-adult' : ''}`} />
      <div className="card-top">
        <div className="card-preview" onMouseEnter={() => setHoverPreview(true)} onMouseLeave={() => setHoverPreview(false)}>
          {post.preview ? (
            <><img src={post.preview} alt="" className="preview-img" style={{ filter: `blur(${blurAmount})`, transform: blurScale }} />
            {shouldBlur && <div className="nsfw-overlay"><span className="nsfw-icon">🔞</span></div>}</>
          ) : <div className="card-preview-empty"><span className="empty-icon">{post.nsfw ? '🔞' : '💬'}</span></div>}
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className={`meta-community ${post.nsfw ? 'adult' : ''}`}>r/{post.community}</span>
            <span className="meta-sep">·</span><span className="meta-author">@{post.author}</span>
            <span className="meta-sep">·</span><span className="meta-time">4ч</span>
            {post.comments > 50 && <span className="hot-badge">🔥 горячо</span>}
          </div>
          <h3 className="card-title">{post.title}</h3>
          {isHovered && !expanded && <span className="scroll-hint">↕ крути</span>}
        </div>
      </div>

      {/* Реакции снизу — только в свёрнутом */}
      {!expanded && (
        <div className="reactions-bar">
          {REACTIONS.map(({ main, related, label }) => (
            <div key={main} className="reaction-group">
              <div className="related-up">
                {related.map((sub, i) => (
                  <button key={sub} className="related-up-btn"
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onClick={(e) => handleReactionClick(sub, e)}>{sub}</button>
                ))}
              </div>
              <button className="reaction-btn" onClick={(e) => handleReactionClick(main, e)} title={label}>
                {main}
              </button>
            </div>
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
            <p className="full-text">Здесь будет полный текст поста. Обсуждение набирает обороты.</p>
            <div className="preview-comments">
              <div className="preview-comment"><span className="pc-author">@user123</span><span className="pc-text">Полностью согласен!</span></div>
              <div className="preview-comment"><span className="pc-author">@dev_guy</span><span className="pc-text">Не могу понять хайп...</span></div>
              <div className="preview-comment"><span className="pc-author">@thinker</span><span className="pc-text">Смотрите глубже.</span></div>
            </div>
          </div>
          <div className="expanded-reactions">
            {REACTIONS.map(({ main, count, label }, i) => (
              <button key={main} className="exp-reaction" style={{ animationDelay: `${0.3 + i * 0.04}s` }}
                onClick={(e) => handleReactionClick(main, e)} title={label}>
                <span className="exp-emoji">{main}</span><span className="exp-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {flyEmojis.map((f) => (
        <span key={f.id} className="fly-particle" style={{
          left: `${f.ox}px`, top: `${f.oy}px`,
          fontSize: `${f.size}px`,
          animationDelay: `${f.delay}s`,
        }}>{f.emoji}</span>
      ))}

      <div className="shine-border" />
    </article>
  );
};

export default PostCard;