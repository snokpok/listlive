import React from 'react';
import AppLogo from '@/public/listlive-icon.png';
import Image from 'next/image';
import { BarLoader } from 'react-spinners';

function LoadingScreen() {
    return (
        <div className="flex flex-col space-y-3 justify-center items-center min-w-screen min-h-screen bg-black">
            <Image src={AppLogo} width={60} height={60} />
            <BarLoader width={10} />
        </div>
    );
}

export default LoadingScreen;
