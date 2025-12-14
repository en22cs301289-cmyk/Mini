 import React from 'react';
import './storyViewer.css';
 import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const publicUrl = process.env.PUBLIC_URL || '';



function StoryViewer({ story, onClose }) {
  if (!story) return null; 

  return (
    <div className="storyOverlay" onClick={onClose}>
      <div className="storyContent" onClick={(e) => e.stopPropagation()}>
        

        
        
        {(() => {
          const safeVideo = story.video && String(story.video).trim() !== '' ? story.video : null;
          const safeImg = story.img && String(story.img).trim() !== '' ? story.img : `${publicUrl}/comment.jpg`;
          return safeVideo ? (
            <video className="storyImage" src={safeVideo} autoPlay playsInline />
          ) : (
            <img className="storyImage" src={safeImg} alt={story.profileName} />
          );
        })()}
        <div className="storyHeader">
          <img className="storyProfilePic" src={(story.img && String(story.img).trim() !== '') ? story.img : `${publicUrl}/comment.jpg`} alt={story.profileName} />
          <span className="storyProfileName">{story.profileName}</span>
        </div>
        <div className="storyFooter">
            <FavoriteBorderIcon sx={{fontSize: "30px",   position: "absolute", right: "63px", bottom: "20px"}} />
        </div>
      </div>
    </div>
  );
}

export default StoryViewer;