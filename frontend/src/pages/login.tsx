import { UserContext } from '@/common/contexts/user.context';
import LoginForm from '@/components/Auth/LoginForm';
import { useRouter } from 'next/router';
import Head from 'next/head';

import React from 'react';

export default function LoginPage() {
    const router = useRouter();
    const userContext = React.useContext(UserContext);

    if (userContext.user.token) {
        router.replace('/app');
        return null;
    }

    return (
        <>
            <Head>
                <title>Login | Listlive</title>
            </Head>
            <div className="bg-black flex flex-col items-center justify-center min-h-screen min-w-full">
                <LoginForm />
            </div>
        </>
    );
}
