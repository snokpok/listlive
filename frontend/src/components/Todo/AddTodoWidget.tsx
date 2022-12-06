import { IoIosAddCircleOutline } from 'react-icons/io';
import TodoEditorContext from '@/common/contexts/todo-editor.context';
import React, { ReactElement } from 'react';

export default function AddTodoWidget(): ReactElement {
    const todoEditorContext = React.useContext(TodoEditorContext);
    return (
        <div
            className="flex group space-x-2 cursor-pointer"
            onClick={() => {
                todoEditorContext.setEditor({
                    editingItemId: null,
                    openCreate: true,
                });
            }}
        >
            <div
                style={{
                    borderRadius: '40%',
                }}
            >
                <IoIosAddCircleOutline className="h-6 w-6 text-green-400 group-hover:bg-green-400 rounded-full group-hover:text-white" />
            </div>
            <div className="group-hover:text-green-400 text-gray-400">
                Add task
            </div>
        </div>
    );
}
