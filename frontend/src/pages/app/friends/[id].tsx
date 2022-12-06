import { useViewingUser } from '@/common/stores/useViewingUser';
import ListsWrapper from '@/components/List/ListsWrapper';
import RedirectToLogo from '@/components/Misc/RedirectToLogo';
import WidgetOtherUser from '@/components/User/WidgetOtherUser';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

export default function FriendPage({ userId }: { userId: string }) {
    const { viewingUser, setViewingUser } = useViewingUser((state) => state);

    return (
        <>
            <Head>
                {viewingUser && <title>{viewingUser?.firstName} {viewingUser?.lastName}'s Lists | Listlive</title>}
            </Head>
            <div className="flex bg-black h-screen">
                <div className="flex flex-col justify-center items-center min-h-screen bg-black overflow-auto w-full">
                    <div className="mb-5">
                        <RedirectToLogo
                            path="/app"
                            extraCallbacks={() => setViewingUser(null)}
                        />
                    </div>
                    {viewingUser && <WidgetOtherUser {...(viewingUser as any)} />}
                    <div className="flex flex-col rounded-lg bg-white p-5 pt-0 overflow-y-auto my-10">
                        {userId && <ListsWrapper userId={userId} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.params ? context.params['id'] : null;
    return { props: { userId } };
};
