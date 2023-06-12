'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/users')
    }, [])
    return (
        <h1>Hello, Dashboard Page!</h1>
    );
}

export default Page