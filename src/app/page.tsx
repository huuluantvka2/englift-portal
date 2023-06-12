'use client'
import { AuthContext } from "@/components/authContext";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";


const Page = () => {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    useEffect(() => {
        console.log('isAuthenticated', authContext.isAuthenticated())
        authContext.isAuthenticated() ? router.push('/users') : router.push('/login')
    }, [])
    return (
        <></>
    );
}

export default Page