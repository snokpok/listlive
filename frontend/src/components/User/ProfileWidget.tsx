import { serverConfigs } from '@/common/configs';
import { UserContext } from '@/common/contexts/user.context';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import BarLoader from 'react-spinners/BarLoader';
import LogoutWidget from '../Auth/LogoutWidget';
import { Popover } from 'react-tiny-popover';
import { IEmojiData } from 'emoji-picker-react';
import { axiosReqChangeAttribsUser } from '@/common/web/queries';
import dynamic from 'next/dynamic';
const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function ProfileWidget() {
    const userContext = React.useContext(UserContext);
    const queryProfile = useQuery('get-profile', async () => {
        const res = await axios({
            method: 'get',
            url: `${serverConfigs.backend_dev}/users/me`,
            headers: {
                Authorization: `Bearer ${userContext.user.token}`,
            },
        });
        userContext.setUser((prev) => ({
            ...prev,
            id: res.data._id,
            emoji: res.data.profile_emoji,
        }));
        return res;
    });
    const [openEmojiPicker, setOpenPicker] = React.useState<boolean>(false);
    const [emoji, setEmoji] = React.useState<IEmojiData | null>(null);

    return (
        <div className="flex rounded-lg bg-white p-2 space-x-2 justify-between items-center w-full">
            <Popover
                isOpen={openEmojiPicker}
                positions={['right']}
                content={
                    <div className="bg-white flex flex-col p-2 rounded-md border-gray-400 border-2 h-96 w-full">
                        <Picker
                            onEmojiClick={async (e, emojiObject) => {
                                e.preventDefault();
                                setEmoji(emojiObject);
                                userContext.setUser((prev) => ({
                                    ...prev,
                                    emoji: emojiObject.emoji,
                                }));
                                await axiosReqChangeAttribsUser(
                                    userContext.user.token,
                                    emojiObject.emoji,
                                );
                                setOpenPicker(false);
                            }}
                        />
                    </div>
                }
                onClickOutside={() => setOpenPicker(false)}
            >
                <div
                    onClick={() => setOpenPicker(true)}
                    className="py-2 text-4xl bg-black rounded-full flex flex-col justify-center items-center px-3"
                >
                    {userContext.user.emoji ?? null}
                </div>
            </Popover>
            <div className="flex flex-col justify-center">
                <div className="font-bold">
                    {queryProfile.data?.data.first_name}{' '}
                    {queryProfile.data?.data.last_name}
                </div>
                {!queryProfile.data?.data ? <BarLoader loading={true} /> : null}
                <div className="text-gray-500 font-light">
                    {queryProfile.data?.data.email}
                </div>
            </div>
            <LogoutWidget />
        </div>
    );
}
