import React from 'react';
import Image from 'next/image';
import AppLogo from '@/public/listlive-icon.png';
import router from 'next/router';

export interface RedirectToLogoProps {
    path: string;
    extraCallbacks?: Function;
}

export default function RedirectToLogo({
    path,
    extraCallbacks,
}: RedirectToLogoProps) {
    return (
        <div>
            <Image
                src={AppLogo}
                width={40}
                height={40}
                onClick={() => {
                    if (extraCallbacks) {
                        extraCallbacks();
                    }
                    router.replace(path);
                }}
                className="cursor-pointer"
            />
        </div>
    );
}
