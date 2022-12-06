import TodoEditorContext from '@/common/contexts/todo-editor.context';
import { UserContext } from '@/common/contexts/user.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { MyListsInterface, useMyLists } from '@/common/stores/useMyLists';
import { axiosReqEditItem } from '@/common/web/queries';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import TodoInputFormRaw from './TodoInputFormRaw';

export type TodoItemProps = ITodoItem & {
    listId: string;
};

export default function TodoEditFields({
    id,
    description,
    title,
    listId,
}: TodoItemProps) {
    const todoEditorContext = React.useContext(TodoEditorContext);
    const userContext = React.useContext(UserContext);

    const { updateItemFromList } = useMyLists((state) => state);

    const formik = useFormik({
        initialValues: {
            title,
            description,
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string(),
        }),
        onSubmit: async (values, actions) => {
            const updateReq = axiosReqEditItem(
                userContext.user.token,
                listId,
                id,
                values,
            );
            await toast.promise(
                updateReq,
                {
                    loading: 'Updating todo item',
                    success: 'Item updated',
                    error: "Oops, couldn't update todo item",
                },
                { position: 'bottom-left' },
            );
            updateItemFromList(listId, id, values);
            actions.setSubmitting(false);
            actions.setValues({ title: '', description: '' });
            todoEditorContext.setEditor({
                editingItemId: null,
                openCreate: false,
            });
        },
    });

    return <TodoInputFormRaw formik={formik} submitButtonValue={'Save'} />;
}
