import { useState, useRef, useEffect } from 'react';
import './PostCard.css';

const REACTIONS = [
  { main: '🔥', related: ['❤️‍🔥', '💥', '🎆'], label: 'Огонь', count: 142, effect: 'fire' },
  { main: '💎', related: ['🏆', '✨', '👑'], label: 'Ценно', count: 89, effect: 'diamond' },
  { main: '🧠', related: ['🤔', '📚', '💡'], label: 'Умно', count: 56, effect: 'brain' },
  { main: '🤡', related: ['😂', '💀', '🤪'], label: 'Смешно', count: 34, effect: 'clown' },
  { main: '🚩', related: ['⚠️', '🤨', '👎'], label: 'Спорно', count: 12, effect: 'flag' },
];

const EFFECTS = {
  fire: [
    { emojis: ['🔥','💥','🎆','🔥','💥','🎆','🔥'], count:7, spread:55, angle:[0,6.28], sizes:[8,26] },
    { emojis: ['🔥','🔥','💥','🔥','🎆'], count:5, spread:40, angle:[0.5,5.5], sizes:[12,24] },
    { emojis: ['💥','🎆','🔥','💥','🔥','🎆','💥','🔥'], count:8, spread:60, angle:[1,5], sizes:[6,22] },
    { emojis: ['🔥','🎆','🔥','💥','🔥','🎆'], count:6, spread:45, angle:[2,4.5], sizes:[10,28] },
    { emojis: ['🎆','💥','🔥','🎆','💥'], count:5, spread:35, angle:[3,6], sizes:[14,20] },
    { emojis: ['🔥','💥','🔥','🎆','💥','🔥','🎆'], count:7, spread:50, angle:[0,3], sizes:[8,24] },
  ],
  diamond: [
    { emojis: ['💎','💠','💎','💠','💎'], count:5, spread:30, angle:[0,6.28], sizes:[10,18] },
    { emojis: ['💠','💎','💠','💎','💠','💎'], count:6, spread:35, angle:[1,5], sizes:[8,16] },
    { emojis: ['💎','💠','💠','💎'], count:4, spread:25, angle:[2,4], sizes:[12,20] },
    { emojis: ['💠','💎','💠','💎','💠'], count:5, spread:40, angle:[0.5,5.5], sizes:[8,14] },
    { emojis: ['💎','💠','💎','💠'], count:4, spread:28, angle:[3,6], sizes:[14,22] },
    { emojis: ['💠','💠','💎','💠','💎','💠'], count:6, spread:32, angle:[0,4], sizes:[10,16] },
  ],
  brain: [
    { emojis: ['🧠','💡','📚','🤔'], count:4, spread:30, angle:[-0.3,0.3], sizes:[12,20], vertical:true },
    { emojis: ['💡','🧠','💡','📚','🤔'], count:5, spread:35, angle:[-0.4,0.4], sizes:[10,18], vertical:true },
    { emojis: ['📚','🧠','💡'], count:3, spread:22, angle:[-0.2,0.2], sizes:[14,24], vertical:true },
    { emojis: ['🧠','🤔','💡','🧠','📚','💡'], count:6, spread:40, angle:[-0.5,0.5], sizes:[8,16], vertical:true },
    { emojis: ['💡','🧠','💡','📚'], count:4, spread:28, angle:[-0.35,0.35], sizes:[12,22], vertical:true },
    { emojis: ['🤔','📚','🧠','💡','🤔'], count:5, spread:33, angle:[-0.45,0.45], sizes:[10,17], vertical:true },
  ],
  clown: [
    { emojis: ['🤡','😂','💀','🤪','😂','🤡'], count:6, spread:50, angle:[0,6.28], sizes:[10,22] },
    { emojis: ['😂','🤪','💀','🤡','😂'], count:5, spread:44, angle:[1,5.5], sizes:[12,24] },
    { emojis: ['🤪','😂','🤡','💀','😂','🤪'], count:6, spread:55, angle:[0.5,5], sizes:[8,18] },
    { emojis: ['💀','🤡','😂','🤪'], count:4, spread:38, angle:[2,4.5], sizes:[14,26] },
    { emojis: ['🤡','😂','🤪','💀','😂','🤡','🤪'], count:7, spread:60, angle:[3,6], sizes:[6,16] },
    { emojis: ['😂','🤪','🤡','💀','😂'], count:5, spread:48, angle:[0,3.5], sizes:[10,20] },
  ],
  flag: [
    { emojis: ['🚩','⚠️','🤨','👎'], count:4, spread:35, angle:[-0.5,0.5], sizes:[12,18], horizontal:true },
    { emojis: ['⚠️','🚩','👎','🤨','🚩'], count:5, spread:42, angle:[-0.6,0.6], sizes:[10,16], horizontal:true },
    { emojis: ['🚩','👎','⚠️'], count:3, spread:28, angle:[-0.3,0.3], sizes:[14,22], horizontal:true },
    { emojis: ['👎','⚠️','🚩','🤨','👎','🚩'], count:6, spread:48, angle:[-0.7,0.7], sizes:[8,14], horizontal:true },
    { emojis: ['🤨','🚩','⚠️','👎'], count:4, spread:32, angle:[-0.4,0.4], sizes:[12,20], horizontal:true },
    { emojis: ['🚩','🤨','👎','⚠️','🚩'], count:5, spread:38, angle:[-0.55,0.55], sizes:[10,15], horizontal:true },
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
  const clickIdx = useRef({});

  const shouldBlur = post.nsfw && !isUnlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      setExpanded(false);
      setActiveReaction(null);
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

  const handleReactionEnter = (emoji) => {
    clearTimeout(hideTimer.current);
    setActiveReaction(emoji);
  };
  const handleReactionLeave = () => {
    hideTimer.current = setTimeout(() => setActiveReaction(null), 400);
  };

  const handleReactionClick = (emoji, effectKey, e) => {
    e.stopPropagation();
    if (!clickIdx.current[effectKey]) clickIdx.current[effectKey] = 0;
    const presets = EFFECTS[effectKey];
    const p = presets[clickIdx.current[effectKey] % presets.length];
    clickIdx.current[effectKey]++;

    const id = Date.now();
    const flies = [];
    for (let i = 0; i < p.count; i++) {
      let x, y;
      if (p.vertical) {
        x = (Math.random() - 0.5) * p.spread * 0.6;
        y = -10 - (i / p.count) * p.spread - Math.random() * 12;
      } else if (p.horizontal) {
        x = (i % 2 === 0 ? -1 : 1) * (12 + Math.random() * p.spread);
        y = (Math.random() - 0.5) * p.spread * 0.5;
      } else {
        const a = p.angle[0] + (i / p.count) * (p.angle[1] - p.angle[0]) + (Math.random() - 0.5) * 0.5;
        const d = 15 + Math.random() * p.spread;
        x = Math.cos(a) * d;
        y = Math.sin(a) * d - 8;
      }
      flies.push({
        id: id + i,
        emoji: p.emojis[i] || emoji,
        x, y,
        size: p.sizes[0] + Math.random() * (p.sizes[1] - p.sizes[0]),
        rot: (Math.random() - 0.5) * 40,
        delay: i * 0.022,
      });
    }
    setFlyEmojis((prev) => [...prev, ...flies]);
    setTimeout(() => setFlyEmojis((prev) => prev.filter((f) => !flies.includes(f))), 850);
  };

  const handleClick = () => {
    if (post.nsfw && !isUnlocked) alert('Гейт — позже');
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
        {!expanded && (
          <div className={`reaction-panel ${isHovered ? 'on' : ''}`}>
            {REACTIONS.map(({ main, count, label, effect }) => (
              <button key={main} className={`reaction-pill ${activeReaction === main ? 'active' : ''}`}
                onMouseEnter={() => handleReactionEnter(main)} onMouseLeave={handleReactionLeave}
                onClick={(e) => handleReactionClick(main, effect, e)} title={label}>
                <span className="rp-emoji">{main}</span><span className="rp-count">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {!expanded && (
        <div className={`related-row ${activeData ? 'show' : ''}`} onMouseEnter={() => clearTimeout(hideTimer.current)} onMouseLeave={handleReactionLeave}>
          {activeData?.related.map((sub, i) => (
            <button key={sub} className="rel-btn" style={{ animationDelay: `${i * 0.03}s` }} onClick={(e) => handleReactionClick(sub, 'clown', e)}>{sub}</button>
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
              <button key={main} className="exp-reaction" style={{ animationDelay: `${0.3 + i * 0.04}s` }}
                onClick={(e) => handleReactionClick(main, effect, e)} title={label}>
                <span className="exp-emoji">{main}</span><span className="exp-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {flyEmojis.map((f) => (
        <span key={f.id} className="fly-particle" style={{
          '--x':`${f.x}px`,'--y':`${f.y}px`,'--s':`${f.size}px`,'--r':`${f.rot}deg`,'--d':`${f.delay}s`
        }}>{f.emoji}</span>
      ))}
      <div className="shine-border" />
    </article>
  );
};

export default PostCard;