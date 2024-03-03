import React from "react";
import spin from "../Spinner/spinner.gif"

let Spinner = () =>{
    return(
        <>
            <div>
                <img src={spin} alt="" className="d-block m-auto" style={{width:'70px'}} />
            </div>
        </>
    )
};

export default Spinner;