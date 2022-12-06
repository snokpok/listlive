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
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useViewingUser } from '@/common/stores/useViewingUser';
import { useMyLists } from '@/common/stores/useMyLists';
import { TodoListInterface } from '@/common/interfaces/list-interfaces';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useFormik } from 'formik';
import ListInputFormRaw from './ListInputFormRaw';
import { NoItemsPlaceholder } from '../Misc/NoItemsPlaceholder';
import TodoItem from '../Todo/TodoItem';
import TodoCreatorFields from '../Todo/TodoCreatorFields';

interface ListProps {
  listData: TodoListInterface;
}

export const ListEditAttribsForm = () => (
  <form>
    <input />
  </form>
);

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
        listData.id,
      );
      await toast.promise(res, {
        success: `Todo list edited`,
        error: `Oops an error occurred`,
        loading: `Editing list...`,
      });
      editListMeta(listData.id, values as any);
      setEditingMetas(false);
      actions.setSubmitting(false);
    },
  });

  const viewingUser = useViewingUser((state) => state.viewingUser);

  const handleDragEndTodoItem: OnDragEndResponder = async (result) => {
    if (!result.destination) return;

    const newArrayTodos = Array.from(
      lists.find((item) => item.id === listData.id)!.items,
    );
    const [poppedItem] = newArrayTodos.splice(result.source.index, 1);
    newArrayTodos.splice(
      result.destination?.index ?? result.source.index,
      0,
      poppedItem,
    );
    setItemsToList(listData.id, newArrayTodos);
    const res = axiosReqChangeItemOrder(
      user.token,
      {
        newOrder: result.destination.index,
      },
      listData.id,
      result.draggableId,
    );
    await toast.promise(res, {
      loading: `Updating order of todo items`,
      error: `Oops something wrong happened`,
      success: `Updated order of item`,
    });
  };

  return (
    <TodoEditorContext.Provider value={{ editor, setEditor }}>
      <div className="flex flex-col border-l-2 p-2">
        <div className="flex justify-between">
          {!editingMetas ? (
            <div className="flex flex-col mb-2">
              <button
                type="button"
                className={`font-bold text-2xl ${
                  !viewingUser ? `cursor-pointer` : ``
                }`}
                onClick={() => {
                  if (!viewingUser) setEditingMetas(!editingMetas);
                }}
              >
                {listData.title}
              </button>
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
                  await axiosReqDeleteList(user.token, listData.id);
                  deleteListFromLists(listData.id);
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
                  {(ps) => (
                    <div
                      className="todo-list"
                      {...ps.droppableProps}
                      ref={ps.innerRef}
                    >
                      {listData.items.map((item: ITodoItem, index: number) => (
                        <Draggable
                          isDragDisabled={!!viewingUser}
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(props) => (
                            <div
                              {...props.draggableProps}
                              ref={props.innerRef}
                              {...props.dragHandleProps}
                            >
                              <TodoItem {...item} listId={listData.id} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {ps.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
          {!viewingUser ? <TodoCreatorFields listId={listData.id} /> : null}
        </div>
      </div>
    </TodoEditorContext.Provider>
  );
}
