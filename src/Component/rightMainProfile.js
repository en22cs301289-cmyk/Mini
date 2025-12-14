import React from 'react'
import './rightMainProfile.css'
 

function RightMainprofile({profile, userName, Name, follow}) {
    return (
       
        <div className="profilecontainer">
            <div className="nav">
                <div className="profileDiv">
                    <img src={profile} alt="profileImg" />
                    <div className='column'>
                        <div> <span className='userName'>{userName}</span></div>
                         <div><span className='Name'>{Name}</span></div>
                    </div>
                </div>
                <div className="follow">
                    <span className='follow'>{follow}</span>
                </div>

            </div>

             
        </div>
        
        
    )
}

export default RightMainprofile