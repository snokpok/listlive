import TodoEditorContext from '@/common/contexts/todo-editor.context';
import React from 'react';
import { ReactElement } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';

export default function EditTodoWidget(props: { id: string }): ReactElement {
    const todoEditorContext = React.useContext(TodoEditorContext);

    return (
        <AiOutlineEdit
            className="text-xl cursor-pointer opacity-0 hover:text-yellow-500 group-hover:opacity-100 transition"
            onClick={() => {
                todoEditorContext.setEditor({
                    openCreate: false,
                    editingItemId: props.id,
                });
            }}
        />
    );
}
