import TodoEditorContext from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { useMyLists } from '@/common/stores/useMyLists';
import { useViewingUser } from '@/common/stores/useViewingUser';
import { axiosReqDeleteItem } from '@/common/web/queries';
import axios from 'axios';
import React from 'react';
import { ReactElement } from 'react';
import toast from 'react-hot-toast';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BsCheck } from 'react-icons/bs';
import { useMutation } from 'react-query';
import EditTodoWidget from './EditTodoWidget';
import TodoEditFields, { TodoItemProps } from './TodoEditFields';

interface DeleteTodoItemInterface {
    listId: string;
    itemId: string;
}

export const CheckOffItem = ({ listId, itemId }: DeleteTodoItemInterface) => {
    const { user } = React.useContext(UserContext);
    const deleteItemFromList = useMyLists((state) => state.deleteItemFromList);

    const mutationCheckOffItem = useMutation(
        async ({ listId, itemId }: DeleteTodoItemInterface) => {
            const axiosCheckOff = axiosReqDeleteItem(
                user.token,
                listId,
                itemId,
            );
            const { data } = await toast.promise(
                axiosCheckOff,
                {
                    loading: 'Checking off...',
                    success: 'Hurray!!!! Nice job',
                    error: 'Oops something went wrong',
                },
                { icon: '🎊', position: 'bottom-right' },
            );
            deleteItemFromList(listId, itemId);
        },
    );

    return (
        <div className="p-1 mr-2">
            <div className="border-2 border-black bg-gray-100 rounded-full">
                <BsCheck
                    className="text-lg hover:opacity-100 opacity-0 font-bold transition m-1 cursor-pointer"
                    onClick={() => {
                        mutationCheckOffItem.mutate({ listId, itemId });
                    }}
                />
            </div>
        </div>
    );
};

export default function TodoItem({
    listId,
    id,
    title,
    description,
}: TodoItemProps): ReactElement | null {
    const todoEditorContext = React.useContext(TodoEditorContext);
    const { user } = React.useContext(UserContext);
    const viewingUser = useViewingUser((state) => state.viewingUser);
    const deleteItemFromList = useMyLists((state) => state.deleteItemFromList);

    if (todoEditorContext.editor.editingItemId === id)
        return (
            <TodoEditFields
                listId={listId}
                id={id}
                title={title}
                description={description}
            />
        );

    return (
        <div
            className="group bg-white rounded-md flex border-opacity-20 border-b-2 border-black px-2 py-3 justify-between"
            key={id}
        >
            <div className="flex">
                {!viewingUser && <CheckOffItem listId={listId} itemId={id} />}
                <div className="flex flex-col">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">{description}</div>
                </div>
            </div>
            {!viewingUser ? (
                <div className="flex flex-col justify-self-end space-y-1">
                    <AiFillCloseCircle
                        className="hover:text-red-500 transition-colors text-lg cursor-pointer"
                        onClick={async () => {
                            await axiosReqDeleteItem(user.token, listId, id);
                            deleteItemFromList(listId, id);
                        }}
                    />
                    <EditTodoWidget id={id} />
                </div>
            ) : null}
        </div>
    );
}
