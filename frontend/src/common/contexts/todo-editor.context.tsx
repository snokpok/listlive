import React from 'react';

export interface EditorAttribs {
    editingItemId: string | null;
    openCreate: boolean;
}

export interface ITodoEditorCtx {
    editor: EditorAttribs;
    setEditor: React.Dispatch<React.SetStateAction<EditorAttribs>>;
}

const TodoEditorContext = React.createContext<ITodoEditorCtx>({
    editor: { editingItemId: null, openCreate: false },
    setEditor: () => {},
});

export default TodoEditorContext;
