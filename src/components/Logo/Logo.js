import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from "./brain.png"
import "./Logo.css"


const Logo = () =>{
    return (
        <div className="ma4 mt0">
            <Tilt className="br2 shadow-2 Tilt" style={{height:"150px", width:"150px"}}>            
                <img className= "pa3" src={brain} alt="brain" style={{marginTop:"5px"}} />
            </Tilt>
        </div>
    );
}

export default Logo;