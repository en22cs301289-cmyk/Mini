import React from 'react'
import './profileStory.css'

const publicUrl = process.env.PUBLIC_URL || '';

function middleprofileStory({img, profileName}) {
    return (
        <>
        
        <div className="profilediv">
           <div className="imgcircle">
              <div className="bgcwhite">
                  <img src={(img && String(img).trim() !== '') ? img : `${publicUrl}/comment.jpg`} alt=""
             style={{
               
                objectFit: "cover",
                 
             }}
            className="storyImg"/>
            </div>
           </div>
            <span className="profileStoryName" >{profileName}</span> 
        </div>
        </>
    )
}

export default middleprofileStory