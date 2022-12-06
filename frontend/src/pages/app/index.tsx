import React from 'react';
import { UserContext } from '@/common/contexts/user.context';
import ProfileWidget from '@/components/User/ProfileWidget';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ListsWrapper from '@/components/List/ListsWrapper';
import { useQuery } from 'react-query';
import { axiosReqGetUsers } from '@/common/web/queries';
import { BarLoader } from 'react-spinners';
import WidgetOtherUser from '@/components/User/WidgetOtherUser';
import NoFriendsPlaceholder from '@/components/Misc/NoFriendsPlaceholder';

export function MainListsSection() {
    const { user } = React.useContext(UserContext);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black overflow-auto w-full">
            <div className="flex flex-col rounded-lg bg-white p-5 pt-0 overflow-y-auto my-10">
                {user.token && <ListsWrapper />}
            </div>
        </div>
    );
}

export function SidebarSection() {
    const { user } = React.useContext(UserContext);
    const { data, isLoading, error } = useQuery('get-friends', async () => {
        return axiosReqGetUsers(user.token);
    });

    return (
        <div className="flex flex-col items-center p-5 h-5/6 bg-white shadow-sm rounded-r-xl">
            <div className="font-bold text-3xl">Your friends</div>
            <div className="flex flex-wrap justify-center p-3 overflow-auto">
                {!isLoading ? (
                    data?.data.map((user: any) => {
                        return (
                            <div key={user._id}>
                                <WidgetOtherUser
                                    id={user._id}
                                    firstName={user.first_name}
                                    lastName={user.last_name}
                                    email={user.email}
                                    profileEmoji={user.profile_emoji}
                                />
                            </div>
                        );
                    })
                ) : (
                    <BarLoader loading={true} />
                )}
                {!isLoading && data?.data.length === 0 ? (
                    <NoFriendsPlaceholder />
                ) : null}
            </div>
        </div>
    );
}

export default function AppHome() {
    const { user } = React.useContext(UserContext);
    const router = useRouter();

    React.useEffect(() => {
        if (!user.token) {
            router.replace('/login');
        }
    }, [user.token]);

    return (
        <>
            <Head>
                <title>Home | Listlive</title>
            </Head>
            <div className="flex bg-black h-screen">
                <div className="flex flex-col justify-center w-1/4 mr-5">
                    <div className="ml-2 mb-2">
                        {user.token && <ProfileWidget />}
                    </div>
                    <SidebarSection />
                </div>
                <MainListsSection />
            </div>
        </>
    );
}
