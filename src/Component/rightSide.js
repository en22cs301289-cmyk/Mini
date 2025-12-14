import React from 'react'
import RightMainprofile from './rightMainProfile'
import './rightSide.css';
import RightOtherProfile from './rightOtherProfile';

// Use images from the public folder so the component works even if src/assets is empty
const publicUrl = process.env.PUBLIC_URL || '';
const profile2 = `${publicUrl}/instagram.png`;
const share1 = `${publicUrl}/instagram.png`;

// Minimal placeholder list of suggested profiles (all use public images)
const suggestedProfiles = [
    { img: `${publicUrl}/comment.jpg`, userName: 'mr_devanshrajput', followedBy: 'Followed by shubham_Tomar' },
    { img: `${publicUrl}/comment.jpg`, userName: 'nikshu_pndtt', followedBy: 'Followed by prishu_sharma07' },
    { img: `${publicUrl}/comment.jpg`, userName: 'vansh_pandat_0007', followedBy: 'Followed by jayant_dada' },
    { img: `${publicUrl}/comment.jpg`, userName: 'Ofc_Prisha', followedBy: 'Followed by ritika' },
    { img: `${publicUrl}/comment.jpg`, userName: 'vip_ulfit', followedBy: 'Followed by pndtt_vansh002' }
];
function RightSide() {
    return (
         <>
       <div className="rightSidepage">
        <div className="rightsidebox">
             <RightMainprofile  profile= {profile2} userName="swolprinc" Name= "PRISHU" follow= "Switch"/>
         <div className="suggestnav">
             
                <div>Suggested for you</div>
                <div>See All</div>
             
        </div>
        </div>
                        <div className="otherProfile">
                                {suggestedProfiles.map((p, i) => (
                                    <RightOtherProfile
                                        key={i}
                                        ORprofileImg={p.img}
                                        UserName={p.userName}
                                        FollowedName={p.followedBy}
                                    />
                                ))}
                        </div>
         
         <div className="fixedprofile">
                   <div className="box">
                       <div className='imgMessage'>
                              <img  className = "share" src={share1} alt="Share" /> 
                         
                       </div>
                       <div className="borderimg">
                         <div> <span>Messages</span></div>
                       <div className="rightnav">
                        <div className='frstimg'> <img src={suggestedProfiles[0].img} alt="" /></div>
                        <div className='secndimg'><img src={suggestedProfiles[1].img} alt="" /></div>
                        <div className='thrdimg'><img src={suggestedProfiles[2].img} alt="" /></div>
                       <div className="threedot">
                           <div className='first dot'></div>
                           <div className='second dot'></div>
                           <div className='third dot'></div>
                       </div>
                       </div>
                       </div>
                   </div>
                </div>
        
        </div>
         </>
       
    )
}

export default RightSide 