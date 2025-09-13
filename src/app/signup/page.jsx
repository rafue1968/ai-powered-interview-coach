"use server";
import SignupForm from "../../components/SignupForm";

export default async function Page(){
    return (
        <div className="container">
            <SignupForm />
        </div>
    )
}