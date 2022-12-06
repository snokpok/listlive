import { useViewingUser } from '@/common/stores/useViewingUser';
import router from 'next/router';
import React from 'react';

interface WidgetOtherUserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileEmoji: string;
}

function WidgetOtherUser({
    id,
    firstName,
    lastName,
    email,
    profileEmoji,
}: WidgetOtherUserProps) {
    const { setViewingUser } = useViewingUser((state) => state);

    return (
        <div
            className="m-2 flex flex-col p-3 text-black bg-white drop-shadow-sm w-32 h-32 border-2 items-center rounded-md cursor-pointer"
            onClick={() => {
                router.replace(`/app/friends/${id}`);
                setViewingUser({
                    id,
                    firstName,
                    lastName,
                    email,
                    profileEmoji,
                });
            }}
        >
            <div>
                {firstName} {lastName}
            </div>
            <div className="text-4xl bg-black h-4/6 w-4/6 rounded-full flex flex-col justify-center items-center mt-2">
                {profileEmoji}
            </div>
        </div>
    );
}

export default WidgetOtherUser;
