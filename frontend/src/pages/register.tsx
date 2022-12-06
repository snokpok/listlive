import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import Head from 'next/head';
import React from 'react';

export default function Home() {
    return (
        <>
            <Head>
                <title>Register | Listlive</title>
            </Head>
            <div className="bg-black flex flex-col items-center justify-center min-h-screen min-w-full">
                <RegisterForm />
            </div>
        </>
    );
}
