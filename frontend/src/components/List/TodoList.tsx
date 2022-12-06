import TodoEditorContext, {
    EditorAttribs,
} from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import {
    axiosReqChangeItemOrder,
    axiosReqDeleteList,
    axiosReqEditListAttribs,
    axiosReqGetListById,
} from '@/common/web/queries';
import React from 'react';
import toast from 'react-hot-toast';
import TodoCreatorFields from '../Todo/TodoCreatorFields';
import TodoItem from '../Todo/TodoItem';
import {
    DragDropContext,
    Draggable,
    Droppable,
    OnDragEndResponder,
} from 'react-beautiful-dnd';
import { NoItemsPlaceholder } from '../Misc/NoItemsPlaceholder';
import { useViewingUser } from '@/common/stores/useViewingUser';
import { useMyLists } from '@/common/stores/useMyLists';
import { TodoListInterface } from '@/common/interfaces/list-interfaces';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { AiFillCloseCircle } from 'react-icons/ai';
import ListInputFormRaw from './ListInputFormRaw';
import { useFormik } from 'formik';

interface ListProps {
    listData: TodoListInterface;
}

export const ListEditAttribsForm = () => {
    return (
        <form>
            <input></input>
        </form>
    );
};

export default function TodoList({ listData }: ListProps) {
    /*
    TodoList component
    - dynamically fetch its content with listId prop
    */
    const { user } = React.useContext(UserContext);
    const [editingMetas, setEditingMetas] = React.useState(false);
    const [editor, setEditor] = React.useState<EditorAttribs>({
        editingItemId: null,
        openCreate: false,
    });
    const { lists, setItemsToList, deleteListFromLists, editListMeta } =
        useMyLists((state) => state);

    const formik = useFormik({
        initialValues: {
            title: listData.title,
            description: listData.description,
        },
        onSubmit: async (values, actions) => {
            const res = axiosReqEditListAttribs(
                user.token,
                values as any,
                listData._id,
            );
            await toast.promise(res, {
                success: 'Todo list edited',
                error: 'Oops an error occurred',
                loading: 'Editing list...',
            });
            editListMeta(listData._id, values as any);
            setEditingMetas(false);
            actions.setSubmitting(false);
        },
    });

    const viewingUser = useViewingUser((state) => state.viewingUser);

    const handleDragEndTodoItem: OnDragEndResponder = async (result) => {
        if (!result.destination) return;

        const newArrayTodos = Array.from(
            lists.find((item) => item._id === listData._id)!.items,
        );
        const [poppedItem] = newArrayTodos.splice(result.source.index, 1);
        newArrayTodos.splice(
            result.destination?.index ?? result.source.index,
            0,
            poppedItem,
        );
        setItemsToList(listData._id, newArrayTodos);
        const res = axiosReqChangeItemOrder(
            user.token,
            {
                newOrder: result.destination.index,
            },
            listData._id,
            result.draggableId,
        );
        await toast.promise(res, {
            loading: 'Updating order of todo items',
            error: 'Oops something wrong happened',
            success: 'Updated order of item',
        });
    };

    return (
        <TodoEditorContext.Provider value={{ editor, setEditor }}>
            <div className="flex flex-col border-l-2 p-2">
                <div className="flex justify-between">
                    {!editingMetas ? (
                        <div className="flex flex-col mb-2">
                            <div
                                className={`font-bold text-2xl ${
                                    !viewingUser ? 'cursor-pointer' : ''
                                }`}
                                onClick={() => {
                                    if (!viewingUser)
                                        setEditingMetas(!editingMetas);
                                }}
                            >
                                {listData.title}
                            </div>
                            {listData.description}
                        </div>
                    ) : (
                        <ListInputFormRaw
                            formik={formik}
                            submitButtonValue="Save"
                            onCancel={() => setEditingMetas(false)}
                        />
                    )}
                    <div>
                        {!viewingUser ? (
                            <AiFillCloseCircle
                                className="hover:text-red-500 transition-colors text-lg cursor-pointer"
                                onClick={async () => {
                                    await axiosReqDeleteList(
                                        user.token,
                                        listData._id,
                                    );
                                    deleteListFromLists(listData._id);
                                }}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="flex flex-col w-96 max-w-lg max-h-full overflow-y-auto">
                    <div className="p-2 border-t-2">
                        {listData.items.length === 0 ? (
                            <NoItemsPlaceholder />
                        ) : (
                            <DragDropContext onDragEnd={handleDragEndTodoItem}>
                                <Droppable droppableId="todo-list">
                                    {(props) => (
                                        <div
                                            className="todo-list"
                                            {...props.droppableProps}
                                            ref={props.innerRef}
                                        >
                                            {listData.items.map(
                                                (
                                                    item: ITodoItem,
                                                    index: number,
                                                ) => {
                                                    return (
                                                        <Draggable
                                                            isDragDisabled={
                                                                !!viewingUser
                                                            }
                                                            key={item.id}
                                                            draggableId={
                                                                item.id
                                                            }
                                                            index={index}
                                                        >
                                                            {(props) => (
                                                                <div
                                                                    {...props.draggableProps}
                                                                    ref={
                                                                        props.innerRef
                                                                    }
                                                                    {...props.dragHandleProps}
                                                                >
                                                                    <TodoItem
                                                                        {...item}
                                                                        listId={
                                                                            listData._id
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                },
                                            )}
                                            {props.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </div>
                    {!viewingUser ? (
                        <TodoCreatorFields listId={listData._id} />
                    ) : null}
                </div>
            </div>
        </TodoEditorContext.Provider>
    );
}
