import Header from './components/Header/Header';
import PostCard from './components/Feed/PostCard';
import Sidebar from './components/Sidebar/Sidebar';
import { mockPosts } from './data/mockPosts';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-layout">
        <main className="main-content">
          <div className="feed">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;