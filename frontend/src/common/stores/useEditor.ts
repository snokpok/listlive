import create from 'zustand';

export interface EditorInterface {
    editingItemId: string | null;
    openCreate: boolean;
    onListId: string | null;
}

export interface EditorStoreInterface {
    editor: EditorInterface;
    setEditor: (newEditor: EditorInterface) => void;
}

export const useEditor = create<EditorStoreInterface>((set) => ({
    editor: {
        editingItemId: null,
        openCreate: false,
        onListId: null,
    },
    setEditor: (newEditor) =>
        set(({ editor }) => ({
            editor: { ...editor, newEditor },
        })),
}));
