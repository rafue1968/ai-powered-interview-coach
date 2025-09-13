"use client";

import { useRouter } from "next/navigation";


export default function NavigationButton(props){
    
    const router = useRouter();

    function handleClick(){
        router.push(`/${props.routeText}`)
    }


    return (
        <div>
            <button onClick={handleClick} type="button" className={`navButton ${props.className}`} >{props.buttonText}</button>
        </div>
    )
}