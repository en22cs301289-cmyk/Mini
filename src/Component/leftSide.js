import React from 'react'
import './leftSide.css'
import LeftnavLink from './leftnavlink';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import instalogo from '../assets/instalogo.png';
 import profile from '../assets/profile.png';
 import SlideshowIcon from '@mui/icons-material/Slideshow';
 import MessageIcon from '@mui/icons-material/Message';
 import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
 import AddIcon from '@mui/icons-material/Add';
 import MenuIcon from '@mui/icons-material/Menu';
 

 

function LeftSide() {
    return (
         <div className="leftSidePart">
            <div className="logopart">
             <img className='logoimg' src= {instalogo} alt = 'Instagram' />
        </div>

            <div className="navlinkpart">
                <LeftnavLink navIcon={HomeIcon} navName="Home" />
                <LeftnavLink navIcon={SearchIcon} navName="Search" />
                <LeftnavLink navIcon={ExploreIcon} navName="Explore" />
                <LeftnavLink navIcon={SlideshowIcon} navName="Reels" />
                <LeftnavLink navIcon={MessageIcon} navName="Messages" />
                <LeftnavLink navIcon={FavoriteBorderIcon} navName="Notifications" />
                <LeftnavLink navIcon={AddIcon} navName="Create" />

                <div className="navlink">
                    <img className='navprofileimg' src={profile} alt="profileimg" />
                    <div className="navNamep">Profile</div>
                </div>

                <div className="belowPart">
                    <LeftnavLink navIcon={MenuIcon} navName="More" />
                </div>
            </div>


         </div>
    )
}

export default LeftSide