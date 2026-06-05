import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostPage.css';

const PostPage = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('best');
  const [comments, setComments] = useState([
    { id: 1, author: 'tech_guru', text: 'Отличный вопрос! Я бы посоветовал React для старта — экосистема огромная.', time: '3ч', likes: 24, dislikes: 2, replies: [
      { id: 11, author: 'newbie_dev', text: 'А что насчёт Vue? Говорят проще.', time: '2ч', likes: 8, dislikes: 1 },
      { id: 12, author: 'tech_guru', text: 'Vue тоже отличный, но вакансий на React больше.', time: '1ч', likes: 15, dislikes: 0 },
    ]},
    { id: 2, author: 'senior_dev', text: 'Зависит от целей. Если нужна работа — React. Если для себя — что угодно, хоть Svelte.', time: '2ч', likes: 42, dislikes: 3, replies: [] },
    { id: 3, author: 'random_user', text: 'Учи JavaScript в целом, а не фреймворки.', time: '1ч', likes: 12, dislikes: 8, replies: [
      { id: 31, author: 'tech_guru', text: 'Согласен, база важнее всего.', time: '30м', likes: 20, dislikes: 0 },
    ]},
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [aiExpanded, setAiExpanded] = useState(true);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([{ id: Date.now(), author: 'you', text: newComment, time: 'сейчас', likes: 0, dislikes: 0, replies: [] }, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    setComments(comments.map(c => c.id === commentId ? { ...c, replies: [...c.replies, { id: Date.now(), author: 'you', text: replyText, time: 'сейчас', likes: 0, dislikes: 0 }] } : c));
    setReplyText(''); setReplyTo(null);
  };

  const handleLike = (id, isReply, parentId) => {
    if (isReply) {
      setComments(comments.map(c => c.id === parentId ? { ...c, replies: c.replies.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r) } : c));
    } else {
      setComments(comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
    }
  };

  const handleDislike = (id, isReply, parentId) => {
    if (isReply) {
      setComments(comments.map(c => c.id === parentId ? { ...c, replies: c.replies.map(r => r.id === id ? { ...r, dislikes: r.dislikes + 1 } : r) } : c));
    } else {
      setComments(comments.map(c => c.id === id ? { ...c, dislikes: c.dislikes + 1 } : c));
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'best') return (b.likes - b.dislikes) - (a.likes - a.dislikes);
    if (sortBy === 'new') return b.id - a.id;
    if (sortBy === 'controversial') return (b.likes + b.dislikes) - (a.likes + a.dislikes);
    return 0;
  });

  return (
    <div className="post-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>

      {/* AI-помощник — отдельная панель */}
      <div className={`ai-panel ${aiExpanded ? 'expanded' : ''}`}>
        <div className="ai-panel-header" onClick={() => setAiExpanded(!aiExpanded)}>
          <span className="ai-panel-icon">🤖</span>
          <span className="ai-panel-title">AI-Помощник</span>
          <span className="ai-panel-toggle">{aiExpanded ? '▲' : '▼'}</span>
        </div>
        {aiExpanded && (
          <div className="ai-panel-body">
            <p className="ai-summary">
              <strong>Дайджест обсуждения:</strong> Большинство советует React для трудоустройства (рынок). Vue проще для старта. 
              Svelte набирает популярность. Важно знать базу — чистый JavaScript.
            </p>
            <div className="ai-actions">
              <button className="ai-btn">📝 Подробнее</button>
              <button className="ai-btn">💡 Задать вопрос AI</button>
            </div>
          </div>
        )}
      </div>

      {/* Пост */}
      <div className="post-full">
        <div className="post-full-header">
          <span className="post-full-community">r/tech</span><span className="post-full-dot">·</span>
          <span className="post-full-author">u/dev_guy</span><span className="post-full-dot">·</span>
          <span className="post-full-time">4ч</span>
        </div>
        <h1 className="post-full-title">Какой фреймворк учить в 2026?</h1>
        <p className="post-full-text">Всем привет! Я новичок в веб-разработке. Подскажите какой фреймворк сейчас самый востребованный? React до сих пор актуален или уже стоит смотреть в сторону Svelte/Solid?</p>
        <div className="post-full-stats">
          <span>⬆ 142</span><span>💬 {comments.length} комм.</span>
          <span>🔗</span><span>🔖</span>
        </div>
      </div>

      {/* Комментарии */}
      <div className="comments-section">
        <div className="comments-top">
          <h2 className="comments-title">Комментарии ({comments.length})</h2>
          <div className="sort-btns">
            <button className={`sort-btn ${sortBy === 'best' ? 'active' : ''}`} onClick={() => setSortBy('best')}>Лучшие</button>
            <button className={`sort-btn ${sortBy === 'new' ? 'active' : ''}`} onClick={() => setSortBy('new')}>Новые</button>
            <button className={`sort-btn ${sortBy === 'controversial' ? 'active' : ''}`} onClick={() => setSortBy('controversial')}>Спорные</button>
          </div>
        </div>

        <div className="comment-input-box">
          <textarea className="comment-input" placeholder="Напишите комментарий..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={2} />
          <button className="comment-submit" onClick={handleAddComment}>Отправить</button>
        </div>

        <div className="comments-list">
          {sortedComments.map(c => (
            <div key={c.id} className="comment">
              <div className="comment-avatar" style={{ background: `hsl(${c.author.charCodeAt(0) * 40}, 20%, 20%)` }}>
                <span>{c.author[0].toUpperCase()}</span>
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-time">{c.time}</span>
                </div>
                <p className="comment-text">{c.text}</p>
                <div className="comment-actions">
                  <button className="c-btn like" onClick={() => handleLike(c.id, false, null)}>⬆ <span>{c.likes}</span></button>
                  <button className="c-btn dislike" onClick={() => handleDislike(c.id, false, null)}>⬇ <span>{c.dislikes}</span></button>
                  <button className="c-btn" onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>↩ Ответить</button>
                </div>

                {c.replies.length > 0 && (
                  <div className="replies">
                    {c.replies.map(r => (
                      <div key={r.id} className="reply">
                        <div className="comment-avatar small" style={{ background: `hsl(${r.author.charCodeAt(0) * 40}, 20%, 20%)` }}>
                          <span>{r.author[0].toUpperCase()}</span>
                        </div>
                        <div className="comment-body">
                          <div className="comment-header">
                            <span className="comment-author">{r.author}</span>
                            <span className="comment-time">{r.time}</span>
                          </div>
                          <p className="comment-text">{r.text}</p>
                          <div className="comment-actions">
                            <button className="c-btn like" onClick={() => handleLike(r.id, true, c.id)}>⬆ <span>{r.likes}</span></button>
                            <button className="c-btn dislike" onClick={() => handleDislike(r.id, true, c.id)}>⬇ <span>{r.dislikes}</span></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyTo === c.id && (
                  <div className="reply-box">
                    <input className="reply-input" placeholder="Напишите ответ..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                    <button className="reply-submit" onClick={() => handleAddReply(c.id)}>↩</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;