 import React, { useState } from 'react'
 import './rightOtherProfile.css'
 
 function RightOtherProfile({ORprofileImg, UserName, FollowedName}) {

    let [follow, setFollow] = useState("Follow")
    const followkro = () =>{
        setFollow( (follow) => (follow === "Follow" ? "Following" : "Follow"));
        
    }
    return (
        <>
            <div className="otherProfile">
                 <div  className='namebox' >
                    <img  src={ORprofileImg} alt="profileImg" />
                    <div  className='profilenav'>
                         <div  className='rightdiv'>
                            <div><span className='username'>{UserName}</span></div>
                            <div><span className='followedname'>{FollowedName}</span></div>
                       </div>
                        <div className='leftdiv' >
                            <button onClick={followkro}  className={follow === "Follow" ? "follow-btn" : "following-btn"}>{follow}</button>
                        </div>
                    </div>
                 </div>
            </div>
        </>
    )
 }
 
 export default RightOtherProfile
 