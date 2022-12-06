import { UserContext } from '@/common/contexts/user.context';
import { ITodoItem } from '@/common/interfaces/todo-interfaces';
import { axiosReqCreateItemAtList } from '@/common/web/queries';
import { useFormik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import TodoEditorContext from '@/common/contexts/todo-editor.context';
import TodoInputFormRaw from './TodoInputFormRaw';
import AddTodoWidget from './AddTodoWidget';
import { useMyLists } from '@/common/stores/useMyLists';
import shallow from 'zustand/shallow';

interface ITodoCreatorField {
    listId: string;
}

export default function TodoCreatorFields({ listId }: ITodoCreatorField) {
    const todoEditorContext = React.useContext(TodoEditorContext);
    const userContext = React.useContext(UserContext);
    const { addItemsToList } = useMyLists((state) => state, shallow);

    const createTodoItemMutation = useMutation(
        async (item: Omit<ITodoItem, 'id'>) => {
            const axiosReq = axiosReqCreateItemAtList(
                userContext.user.token,
                item,
                listId,
            );
            const { data } = await toast.promise(
                axiosReq,
                {
                    loading: 'Creating todo item',
                    success: 'Created',
                    error: "Couldn't create todo item",
                },
                { position: 'bottom-left' },
            );
            const newItem = {
                id: data.id,
                title: item.title,
                description: item.description,
            };
            addItemsToList(listId, [newItem]);
            return data;
        },
    );

    const formik = useFormik({
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            description: Yup.string(),
        }),
        initialValues: { title: '', description: '' },
        onSubmit: (values, actions) => {
            createTodoItemMutation.mutate(values as any);
            actions.setSubmitting(false);
            actions.setValues({ title: '', description: '' });
        },
    });

    if (!todoEditorContext.editor.openCreate) return <AddTodoWidget />;

    return <TodoInputFormRaw formik={formik} submitButtonValue={'Add task'} />;
}
