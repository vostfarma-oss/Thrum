import { useState, useRef, useEffect } from 'react';
import './PostCard.css';

const REACTIONS = [
  { main: '🔥', related: ['❤️‍🔥', '💥', '🎆'], label: 'Огонь', count: 142, effect: 'fire' },
  { main: '💎', related: ['🏆', '✨', '👑'], label: 'Ценно', count: 89, effect: 'diamond' },
  { main: '🧠', related: ['🤔', '📚', '💡'], label: 'Умно', count: 56, effect: 'brain' },
  { main: '🤡', related: ['😂', '💀', '🤪'], label: 'Смешно', count: 34, effect: 'clown' },
  { main: '🚩', related: ['⚠️', '🤨', '👎'], label: 'Спорно', count: 12, effect: 'flag' },
];

const EFFECT_PRESETS = {
  fire: [
    { particles: 7, emojis: ['🔥','🔥','💥','🎆','🔥','💥','🎆'], spread: 55, sizeRange: [8, 26], angleRange: [-0.6, 0.6] },
    { particles: 5, emojis: ['🔥','💥','🔥','🎆','🔥'], spread: 40, sizeRange: [12, 22], angleRange: [-0.8, 0.2] },
    { particles: 8, emojis: ['🔥','🎆','💥','🔥','💥','🎆','🔥','🔥'], spread: 60, sizeRange: [6, 28], angleRange: [-0.4, 0.8] },
    { particles: 6, emojis: ['💥','🔥','🎆','🔥','💥','🔥'], spread: 48, sizeRange: [10, 20], angleRange: [-0.5, 0.5] },
    { particles: 9, emojis: ['🔥','🔥','💥','🔥','🎆','💥','🔥','🎆','🔥'], spread: 65, sizeRange: [5, 24], angleRange: [-0.7, 0.7] },
    { particles: 4, emojis: ['🎆','💥','🔥','🎆'], spread: 35, sizeRange: [14, 30], angleRange: [-0.3, 0.3] },
  ],
  diamond: [
    { particles: 5, emojis: ['💎','💠','💎','💠','💎'], spread: 35, sizeRange: [10, 16], angleRange: [-1, 1] },
    { particles: 6, emojis: ['💠','💎','💠','💎','💠','💎'], spread: 40, sizeRange: [8, 14], angleRange: [-0.8, 0.8] },
    { particles: 4, emojis: ['💎','💎','💠','💎'], spread: 30, sizeRange: [12, 18], angleRange: [-0.5, 0.5] },
    { particles: 7, emojis: ['💠','💎','💠','💎','💠','💎','💠'], spread: 45, sizeRange: [6, 12], angleRange: [-1.2, 1.2] },
    { particles: 5, emojis: ['💎','💠','💎','💠','💎'], spread: 38, sizeRange: [10, 15], angleRange: [-0.6, 0.6] },
    { particles: 6, emojis: ['💠','💠','💎','💠','💎','💠'], spread: 42, sizeRange: [8, 16], angleRange: [-0.9, 0.9] },
  ],
  brain: [
    { particles: 4, emojis: ['🧠','💡','📚','🤔'], spread: 30, sizeRange: [12, 20], angleRange: [-0.3, 0.3], vertical: true },
    { particles: 5, emojis: ['🧠','💡','🧠','📚','🤔'], spread: 35, sizeRange: [10, 18], angleRange: [-0.4, 0.4], vertical: true },
    { particles: 3, emojis: ['💡','🧠','📚'], spread: 25, sizeRange: [14, 22], angleRange: [-0.2, 0.2], vertical: true },
    { particles: 6, emojis: ['🧠','🤔','💡','🧠','📚','💡'], spread: 40, sizeRange: [8, 16], angleRange: [-0.5, 0.5], vertical: true },
    { particles: 4, emojis: ['📚','🧠','💡','🤔'], spread: 32, sizeRange: [12, 20], angleRange: [-0.35, 0.35], vertical: true },
    { particles: 5, emojis: ['💡','🧠','💡','📚','🧠'], spread: 38, sizeRange: [10, 17], angleRange: [-0.45, 0.45], vertical: true },
  ],
  clown: [
    { particles: 6, emojis: ['🤡','😂','💀','🤪','😂','🤡'], spread: 50, sizeRange: [10, 22], angleRange: [-0.8, 0.8] },
    { particles: 5, emojis: ['😂','🤡','💀','🤪','😂'], spread: 45, sizeRange: [12, 20], angleRange: [-0.6, 0.6] },
    { particles: 7, emojis: ['🤪','😂','🤡','💀','😂','🤪','🤡'], spread: 55, sizeRange: [8, 18], angleRange: [-0.9, 0.9] },
    { particles: 4, emojis: ['💀','🤡','😂','🤪'], spread: 40, sizeRange: [14, 24], angleRange: [-0.5, 0.5] },
    { particles: 8, emojis: ['🤡','😂','🤪','💀','😂','🤡','🤪','😂'], spread: 60, sizeRange: [6, 16], angleRange: [-1, 1] },
    { particles: 5, emojis: ['😂','🤪','🤡','💀','😂'], spread: 48, sizeRange: [10, 21], angleRange: [-0.7, 0.7] },
  ],
  flag: [
    { particles: 4, emojis: ['🚩','⚠️','🤨','👎'], spread: 35, sizeRange: [12, 18], angleRange: [-0.4, 0.4], horizontal: true },
    { particles: 5, emojis: ['🚩','👎','⚠️','🤨','🚩'], spread: 40, sizeRange: [10, 16], angleRange: [-0.5, 0.5], horizontal: true },
    { particles: 3, emojis: ['⚠️','🚩','👎'], spread: 30, sizeRange: [14, 20], angleRange: [-0.3, 0.3], horizontal: true },
    { particles: 6, emojis: ['🚩','🤨','⚠️','👎','🚩','⚠️'], spread: 45, sizeRange: [8, 14], angleRange: [-0.6, 0.6], horizontal: true },
    { particles: 4, emojis: ['👎','🚩','⚠️','🤨'], spread: 38, sizeRange: [12, 18], angleRange: [-0.45, 0.45], horizontal: true },
    { particles: 5, emojis: ['⚠️','🚩','👎','🚩','🤨'], spread: 42, sizeRange: [10, 15], angleRange: [-0.55, 0.55], horizontal: true },
  ],
};

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [flyEmojis, setFlyEmojis] = useState([]);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scrollAccum = useRef(0);
  const hideTimer = useRef(null);
  const cardRef = useRef(null);
  const clickCounts = useRef({});

  const shouldBlur = post.nsfw && !isUnlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setExpanded(false);
      }
      setActiveReaction(null);
    }
  }, [isHovered]);

  const handleWheel = (e) => {
    if (!isHovered || expanded) return;
    e.preventDefault();
    scrollAccum.current += e.deltaY;
    if (scrollAccum.current > 45) {
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
    hideTimer.current = setTimeout(() => setActiveReaction(null), 400);
  };

  const handleReactionClick = (emoji, effect, e) => {
    e.stopPropagation();
    if (!clickCounts.current[emoji]) clickCounts.current[emoji] = 0;
    const idx = clickCounts.current[emoji] % EFFECT_PRESETS[effect].length;
    clickCounts.current[emoji]++;

    const preset = EFFECT_PRESETS[effect][idx];
    const id = Date.now();
    const newFlies = [];

    for (let i = 0; i < preset.particles; i++) {
      let angle, dist, x, y;
      if (preset.vertical) {
        angle = (Math.random() - 0.5) * preset.angleRange[1] * 2;
        dist = 10 + Math.random() * preset.spread;
        x = Math.sin(angle) * dist * 0.5;
        y = -10 - (i / preset.particles) * preset.spread - Math.random() * 15;
      } else if (preset.horizontal) {
        const dir = i % 2 === 0 ? -1 : 1;
        x = dir * (15 + Math.random() * preset.spread);
        y = (Math.random() - 0.5) * preset.spread * 0.5;
      } else {
        angle = (i / preset.particles) * Math.PI * 2 + (Math.random() - 0.5) * preset.angleRange[1];
        dist = 15 + Math.random() * preset.spread;
        x = Math.cos(angle) * dist;
        y = Math.sin(angle) * dist - 5;
      }

      newFlies.push({
        id: id + i,
        emoji: preset.emojis[i] || emoji,
        x, y,
        size: preset.sizeRange[0] + Math.random() * (preset.sizeRange[1] - preset.sizeRange[0]),
        rot: (Math.random() - 0.5) * 45,
        delay: i * 0.02,
      });
    }

    setFlyEmojis((p) => [...p, ...newFlies]);
    setTimeout(() => setFlyEmojis((p) => p.filter((f) => !newFlies.includes(f))), 800);
  };

  const handleClick = () => {
    if (post.nsfw && !isUnlocked) {
      alert('Возрастной гейт — будет позже');
      return;
    }
  };

  const blurAmount = shouldBlur ? (hoverPreview ? '6px' : '22px') : 'none';
  const blurScale = shouldBlur && hoverPreview ? 'scale(1.08)' : 'scale(1)';
  const activeData = REACTIONS.find((r) => r.main === activeReaction);

  return (
    <article
      ref={cardRef}
      className={`post-card ${shouldBlur ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''}`}
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
              {shouldBlur && <div className="nsfw-overlay"><span className="nsfw-icon">🔞</span></div>}
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
          {isHovered && !expanded && <span className="scroll-hint">↕ крути</span>}
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
            <button key={sub} className="rel-btn" style={{ animationDelay: `${i * 0.03}s` }}
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
            <p className="full-text">Здесь будет полный текст поста. Обсуждение набирает обороты.</p>
            <div className="preview-comments">
              <div className="preview-comment"><span className="pc-author">@user123</span><span className="pc-text">Полностью согласен!</span></div>
              <div className="preview-comment"><span className="pc-author">@dev_guy</span><span className="pc-text">Не могу понять хайп...</span></div>
              <div className="preview-comment"><span className="pc-author">@thinker</span><span className="pc-text">Смотрите глубже.</span></div>
            </div>
          </div>
          <div className="expanded-reactions">
            {REACTIONS.map(({ main, count, label, effect }, i) => (
              <button key={main} className="exp-reaction" style={{ animationDelay: `${0.35 + i * 0.04}s` }}
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
          '--r': `${f.rot}deg`, '--d': `${f.delay}s`,
        }}>{f.emoji}</span>
      ))}

      <div className="shine-border" />
    </article>
  );
};

export default PostCard;