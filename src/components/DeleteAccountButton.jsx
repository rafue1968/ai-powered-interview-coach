"use client";

import { getAuth, deleteUser } from "firebase/auth";


export default function DeleteAccountButton(){

    function handleClick(){
        const auth = getAuth();
        const user = auth.currentUser;

        deleteUser(user).then(() => {
            alert("Your User Account has been successfully deleted.")
        }).catch((error) => {
            alert("An error with deleting your User Account.")
            console.log(error.message);
        })
    }
    
    return (
        <button onClick={handleClick}>Delete User Account</button>
    )
}