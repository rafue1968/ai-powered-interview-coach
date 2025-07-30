"use client";

import { useRouter } from "next/navigation";


export default function NavigationButton(props){
    
    const router = useRouter();

    function handleClick(){
        router.push(`/${props.routeText}`)
    }


    return (
        <div>
            <button onClick={handleClick} type="submit" className="navButton" >{props.buttonText}</button>
        </div>
    )
}