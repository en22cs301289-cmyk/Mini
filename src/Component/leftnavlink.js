import React from 'react'
import './leftSide.css'


function LeftnavLink({navIcon:Icon, navName}) {
    return (
        <>
        <div className="navlink">
                    <Icon sx={{fontSize: "30px",margin:"0 0px 0" }} /> 
                    <div className="navName">{navName}</div>
               </div>
        </>
    )
}

export default LeftnavLink