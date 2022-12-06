import { UserContext } from '@/common/contexts/user.context';
import {
    axiosReqCreateList,
    axiosReqGetListsUser,
    axiosReqGetMyLists,
} from '@/common/web/queries';
import React from 'react';
import { useQuery } from 'react-query';
import { BarLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useViewingUser } from '@/common/stores/useViewingUser';
import { useMyLists } from '@/common/stores/useMyLists';
import { TodoListInterface } from '@/common/interfaces/list-interfaces';
import TodoList from './TodoList';
import NoListsPlaceholder from '../Misc/NoListsPlaceholder';

interface ListWrapperProps {
    userId?: string;
}
export default function ListsWrapper({ userId }: ListWrapperProps) {
    const { user } = React.useContext(UserContext);
    const { lists, setLists, addListToMyList } = useMyLists((state) => state);
    const viewingUser = useViewingUser((store) => store.viewingUser);

    const { error, isLoading } = useQuery('get-users-lists', async () => {
        let res;
        if (userId) {
            res = await axiosReqGetListsUser(user.token, userId);
        } else {
            res = await axiosReqGetMyLists(user.token, 1);
        }
        setLists(res.data.lists);
        return res;
    });

    if (error) {
        toast.error('Something went wrong');
    }

    return (
        <div className="flex flex-wrap mx-5 p-3">
            <div className="flex flex-col justify-center pr-5">
                {!viewingUser ? (
                    <IoIosAddCircleOutline
                        className="rounded-full mt-3 h-10 w-10 text-black bg-white hover:bg-black transition hover:text-white cursor-pointer"
                        onClick={async () => {
                            const res = await axiosReqCreateList(user.token, {
                                title: 'Untitled list',
                            });
                            addListToMyList({
                                _id: res.data._id,
                                title: 'Untitled list',
                                description: '',
                                items: [],
                            });
                        }}
                    />
                ) : null}
            </div>
            <div className="flex flex-wrap">
                {!isLoading ? (
                    lists.map((list: TodoListInterface) => {
                        return (
                            <div
                                className="flex justify-center items-center m-3"
                                key={list._id}
                            >
                                <TodoList listData={list} />
                            </div>
                        );
                    })
                ) : (
                    <BarLoader />
                )}
                {lists.length === 0 && <NoListsPlaceholder />}
            </div>
        </div>
    );
}
