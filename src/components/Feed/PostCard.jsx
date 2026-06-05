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
    { emojis: ['🔥','💥','🎆','🔥','💥','🎆','🔥'], sizes:[6,8,10,14,18,22,28] },
    { emojis: ['🔥','🔥','💥','🔥','🎆'], sizes:[8,12,16,20,26] },
    { emojis: ['💥','🎆','🔥','💥','🔥','🎆','💥','🔥'], sizes:[5,7,9,12,15,19,24,30] },
    { emojis: ['🔥','🎆','🔥','💥','🔥','🎆'], sizes:[7,11,14,18,22,28] },
    { emojis: ['🎆','💥','🔥','🎆','💥'], sizes:[10,14,18,24,30] },
    { emojis: ['🔥','💥','🔥','🎆','💥','🔥','🎆'], sizes:[6,9,12,16,20,26,32] },
  ],
  diamond: [
    { emojis: ['💎','💠','💎','💠','💎'], sizes:[8,12,16,20,26] },
    { emojis: ['💠','💎','💠','💎','💠','💎'], sizes:[6,10,14,18,22,28] },
    { emojis: ['💎','💠','💠','💎'], sizes:[10,16,22,30] },
    { emojis: ['💠','💎','💠','💎','💠'], sizes:[8,12,17,22,28] },
    { emojis: ['💎','💠','💎','💠'], sizes:[12,18,24,32] },
    { emojis: ['💠','💠','💎','💠','💎','💠'], sizes:[7,11,15,20,26,30] },
  ],
  brain: [
    { emojis: ['🧠','💡','📚','🤔'], sizes:[10,16,22,28], vertical:true },
    { emojis: ['💡','🧠','💡','📚','🤔'], sizes:[8,12,18,24,30], vertical:true },
    { emojis: ['📚','🧠','💡'], sizes:[14,22,32], vertical:true },
    { emojis: ['🧠','🤔','💡','🧠','📚','💡'], sizes:[6,10,14,18,24,30], vertical:true },
    { emojis: ['💡','🧠','💡','📚'], sizes:[12,18,26,34], vertical:true },
    { emojis: ['🤔','📚','🧠','💡','🤔'], sizes:[9,14,20,28,36], vertical:true },
  ],
  clown: [
    { emojis: ['🤡','😂','💀','🤪','😂','🤡'], sizes:[8,12,16,20,26,32] },
    { emojis: ['😂','🤪','💀','🤡','😂'], sizes:[10,15,20,28,36] },
    { emojis: ['🤪','😂','🤡','💀','😂','🤪'], sizes:[7,11,15,20,26,34] },
    { emojis: ['💀','🤡','😂','🤪'], sizes:[14,20,28,38] },
    { emojis: ['🤡','😂','🤪','💀','😂','🤡','🤪'], sizes:[5,8,11,15,20,27,35] },
    { emojis: ['😂','🤪','🤡','💀','😂'], sizes:[10,16,22,30,40] },
  ],
  flag: [
    { emojis: ['🚩','⚠️','🤨','👎'], sizes:[10,16,22,28], horizontal:true },
    { emojis: ['⚠️','🚩','👎','🤨','🚩'], sizes:[8,12,18,24,32], horizontal:true },
    { emojis: ['🚩','👎','⚠️'], sizes:[14,22,34], horizontal:true },
    { emojis: ['👎','⚠️','🚩','🤨','👎','🚩'], sizes:[6,10,14,20,26,34], horizontal:true },
    { emojis: ['🤨','🚩','⚠️','👎'], sizes:[12,18,26,36], horizontal:true },
    { emojis: ['🚩','🤨','👎','⚠️','🚩'], sizes:[9,14,20,28,38], horizontal:true },
  ],
};

const PostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [flyEmojis, setFlyEmojis] = useState([]);
  const [hoverPreview, setHoverPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const scrollAccum = useRef(0);
  const hideTimer = useRef(null);
  const cardRef = useRef(null);
  const clickIdx = useRef({});

  const shouldBlur = post.nsfw && !isUnlocked;

  useEffect(() => {
    if (!isHovered) {
      scrollAccum.current = 0;
      if (expanded) {
        setClosing(true);
        setTimeout(() => {
          setExpanded(false);
          setClosing(false);
        }, 400);
      }
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
    
    const btn = e.currentTarget;
    const card = cardRef.current;
    const btnRect = btn.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const ox = btnRect.left + btnRect.width / 2 - cardRect.left;
    const oy = btnRect.top + btnRect.height / 2 - cardRect.top;
    
    if (!clickIdx.current[effectKey]) clickIdx.current[effectKey] = 0;
    const presets = EFFECTS[effectKey];
    const p = presets[clickIdx.current[effectKey] % presets.length];
    clickIdx.current[effectKey]++;

    const id = Date.now();
    const flies = [];
    const count = p.emojis.length;
    
    for (let i = 0; i < count; i++) {
      let x, y;
      if (p.vertical) {
        x = (Math.random() - 0.5) * 40;
        y = -8 - (i / count) * 60 - Math.random() * 15;
      } else if (p.horizontal) {
        x = (i % 2 === 0 ? -1 : 1) * (12 + Math.random() * 45);
        y = (Math.random() - 0.5) * 35;
      } else {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 12 + Math.random() * 50;
        x = Math.cos(angle) * dist;
        y = Math.sin(angle) * dist - 5;
      }
      flies.push({
        id: id + i,
        emoji: p.emojis[i],
        x, y,
        size: p.sizes[i],
        rot: (Math.random() - 0.5) * 30,
        delay: i * 0.025,
        ox, oy,
      });
    }
    setFlyEmojis((prev) => [...prev, ...flies]);
    setTimeout(() => setFlyEmojis((prev) => prev.filter((f) => !flies.includes(f))), 900);
  };

  const handleClick = () => {
    if (post.nsfw && !isUnlocked) alert('Гейт — позже');
  };

  const blurAmount = shouldBlur ? (hoverPreview ? '5px' : '20px') : 'none';
  const blurScale = shouldBlur && hoverPreview ? 'scale(1.1)' : 'scale(1)';
  const activeData = REACTIONS.find((r) => r.main === activeReaction);

  return (
    <article
      ref={cardRef}
      className={`post-card ${shouldBlur ? 'nsfw' : ''} ${isHovered ? 'hovered' : ''} ${expanded ? 'expanded' : ''} ${closing ? 'closing' : ''}`}
      onMouseEnter={() => { setClosing(false); setIsHovered(true); }}
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
            <button key={sub} className="rel-btn" style={{ animationDelay: `${i * 0.04}s` }}
              onClick={(e) => handleReactionClick(sub, REACTIONS.find(r => r.main === activeReaction)?.effect || 'clown', e)}>{sub}</button>
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
              <button key={main} className="exp-reaction" style={{ animationDelay: `${0.35 + i * 0.05}s` }}
                onClick={(e) => handleReactionClick(main, effect, e)} title={label}>
                <span className="exp-emoji">{main}</span><span className="exp-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {flyEmojis.map((f) => (
        <span key={f.id} className="fly-particle" style={{
          left: `${f.ox}px`,
          top: `${f.oy}px`,
          '--x':`${f.x}px`,
          '--y':`${f.y}px`,
          '--s':`${f.size}px`,
          '--r':`${f.rot}deg`,
          '--d':`${f.delay}s`,
          fontSize: 'var(--s)',
        }}>{f.emoji}</span>
      ))}
      <div className="shine-border" />
    </article>
  );
};

export default PostCard;