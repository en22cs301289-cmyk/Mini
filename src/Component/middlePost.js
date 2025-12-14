import React, { useRef, useState, useEffect } from 'react';
import './middlePost.css';
 import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';    
import FavoriteIcon from '@mui/icons-material/Favorite';
// Use public images as placeholders when src/assets is not present
const publicUrl = process.env.PUBLIC_URL || '';
const share = `${publicUrl}/instagram.png`;
const comment = `${publicUrl}/comment.jpg`;

function MiddlePost({ postId, profileImg, profileName, suggestDetails, date, firstpost, isMuted, onGlobalMute, onLike, onUnlike, onComment, likes = [], comments = [] }) {
  const [follow, setFollow] = useState("Follow");
  // Ensure we don't pass empty strings to `src` props
  const safeProfileImg = profileImg && String(profileImg).trim() !== '' ? profileImg : `${publicUrl}/comment.jpg`;
  const safeVideoSrc = firstpost && String(firstpost).trim() !== '' ? String(firstpost).trim() : null;
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  // Add this new state at the top with others:
  const [isSaved, setIsSaved] = useState(false);


 




  //  Follow/Unfollow logic
  const handleFollowClick = () => {
    if (follow === "Follow") {
      setFollow("Following");
    } else {
      setShowOverlay(true); // Show unfollow overlay
    }
  };

  // Like toggle
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked && typeof onLike === 'function') onLike(postId);
    if (isLiked && typeof onUnlike === 'function') onUnlike(postId);
  };

  //  Play / Pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  //  Mute toggle (global)
  const handleMute = (e) => {
    e.stopPropagation();
    onGlobalMute();
  };

  //  Sync with global mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  //  Replay on end
  const handleEnded = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  //  Scroll-based auto play/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
            setIsPlaying(true);
          } else {
            if (!video.paused) video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);


  //  Pause when tab hidden
//   //  Scroll-based auto play/pause (Play only if at least 60% visible & centered)
// useEffect(() => {
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         const video = videoRef.current;
//         if (!video) return;

//         //  Play only if at least 60% visible AND near the middle of viewport
//         const rect = entry.boundingClientRect;
//         const inView =
//           entry.isIntersecting &&
//           rect.top >= window.innerHeight * 0.2 &&
//           rect.bottom <= window.innerHeight * 0.9;

//         if (inView) {
//           video.play().catch(() => {});
//           setIsPlaying(true);
//         } else {
//           if (!video.paused) video.pause();
//           setIsPlaying(false);
//         }
//       });
//     },
//     { threshold: 0.6 }
//   );

//   if (videoRef.current) observer.observe(videoRef.current);
//   return () => {
//     if (videoRef.current) observer.unobserve(videoRef.current);
//   };
// }, []);


  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        if (!video.paused) video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <>
      <div className="containerfullPost">
        {/* Header Section */}
        <div className="header">
          <img src={profileImg} alt="profileImg" className="headerImg" />
          <div className="profileDetails">
            <div className="profilename">
              <span className="profileName">{profileName}</span>
              <span className="profileDate">{date}</span>
              <span> •</span>
              <span className="follow" onClick={handleFollowClick}>{follow}</span>
            </div>
            <div className="suggest">
              <span className="suggestDetails">{suggestDetails}</span>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="post">
          <div className="videoContainer" onClick={handlePlayPause}>
            {safeVideoSrc ? (
              <video
                ref={videoRef}
                className="postVideo"
                src={safeVideoSrc}
                muted={isMuted}
                onEnded={handleEnded}
                playsInline
              />
            ) : (
              <img className="postVideo" src={safeProfileImg} alt="post placeholder" />
            )}

            {/* Center Play Button */}
            {!isPlaying && <button className="playPauseBtn">▶</button>}

            {/* Mute Button */}
            <button className="muteBtn" onClick={handleMute}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>

        {/* Nav Bar (Like, Comment, Share, Save) */}
        <div className="navpostBar">
          <div className="rightNavPost">
            <div className="iconWrapper" onClick={handleLike}>
              {isLiked ? (
                <FavoriteIcon sx={{ fontSize: "28px", color: "red" }} className="likeAnim" />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: "28px" }} />
              )}
              <div className="likehover">Like</div>
            </div>

            <div className="iconWrapper" onClick={() => {
              const text = prompt('Write a comment')
              if (text && typeof onComment === 'function') onComment(text)
            }}>
              <img className="commentImg" src={comment} alt="comment" />
              <div className="commenthover">Comment</div>
            </div>

            <div className="iconWrapper">
              <img className="shareImg" src={share} alt="share" />
              <div className="sharehover">Share</div>
            </div>
          </div>

          <div className="leftNavPost">
                <div className="iconWrapper" onClick={() => setIsSaved(!isSaved)}>
  {isSaved ? (
    <BookmarkIcon sx={{ fontSize: "28px", color: "black" }} />
  ) : (
    <BookmarkBorderIcon sx={{ fontSize: "28px", color: "black" }} />
  )}
  <div className="savehover">Save</div>
</div>




          </div>
        </div>
      </div>
      {showOverlay && (
        <div className="overlay">
          <div className="overlayContent">
            <div className="profilefollow">
              <div>
                <img src={profileImg} alt="profileImg" className="followImg" />
              </div>
              <div>Unfollow @{profileName}?</div>
            </div>
            <div className="overlayButtons">
              <button
                onClick={() => {
                  setFollow("Follow");
                  setShowOverlay(false);
                }}
              >
                Unfollow
              </button>
              <button onClick={() => setShowOverlay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MiddlePost;