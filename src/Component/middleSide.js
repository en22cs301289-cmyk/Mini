import React, { useState, useEffect } from 'react';
import './middleSide.css';
import ProfileStory from './middlePofileStory';
import StoryViewer from './StoryViewer';
import MiddlePost from './middlePost';
import api from '../api';

const publicUrl = process.env.PUBLIC_URL || '';

function MiddleSide() {
  const [activeStory, setActiveStory] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  const handleGlobalMute = () => setIsMuted(p => !p);

  const loadFeed = async () => {
    try {
      const data = await api.getFeed();
      // data may be an array or { value, Count }
      const items = Array.isArray(data) ? data : data.value || [];
      if (process.env.NODE_ENV === 'development') console.log('loadFeed debug: items.length=', items.length, items)
      setPosts(items);
    } catch (e) {
      console.error('loadFeed', e);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleLike = async (postId) => {
    await api.likePost(postId);
    await loadFeed();
  };

  const handleUnlike = async (postId) => {
    await api.unlikePost(postId);
    await loadFeed();
  };

  const handleComment = async (postId, text) => {
    await api.commentPost(postId, text);
    await loadFeed();
  };

  return (
    <>
      <div className="middleSideSection">
        <div className="storyProfileContainer">
          {/* placeholder stories */}
          <div onClick={() => setActiveStory({ img: `${publicUrl}/comment.jpg`, profileName: 'demo' })}>
            <ProfileStory img={`${publicUrl}/comment.jpg`} profileName={'demo'} />
          </div>
        </div>

        <div className="postContainer">
          <div className="middlePost">
            {posts.map((p) => (
              <MiddlePost
                key={p.id}
                postId={p.id}
                profileImg={(p.authorProfile && p.authorProfile.profilePic) || `${publicUrl}/comment.jpg`}
                profileName={(p.authorProfile && p.authorProfile.username) || 'unknown'}
                date={'• 2d'}
                suggestDetails={p.caption}
                firstpost={p.image}
                isMuted={isMuted}
                onGlobalMute={handleGlobalMute}
                onLike={() => handleLike(p.id)}
                onUnlike={() => handleUnlike(p.id)}
                onComment={(text) => handleComment(p.id, text)}
                likes={p.likes}
                comments={p.comments}
              />
            ))}
          </div>
        </div>
      </div>

      <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
    </>
  );
}

export default MiddleSide;