"use server";
import LoginForm from "../../components/LoginForm"

export default async function Page(){
    return (
        <div className="container">
            <LoginForm />
        </div>
    )
}