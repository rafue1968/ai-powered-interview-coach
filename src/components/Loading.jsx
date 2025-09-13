"use client";


export default function Loading({text = ""}){

    return(
        <div className="loading">{text? text : "Loading"} <span className="dots"></span></div>
    )
}