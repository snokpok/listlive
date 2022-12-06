import create from 'zustand';
import { TodoListInterface } from '../interfaces/list-interfaces';
import { ITodoItem } from '../interfaces/todo-interfaces';

export interface MyListsInterface {
    lists: TodoListInterface[];
    setLists: (lists: TodoListInterface[]) => void;
    addListToMyList: (list: TodoListInterface) => void;
    removeListFromMyLists: (listId: string) => void;
    editListMeta: (listId: string, edit: Omit<ITodoItem, 'id'>) => void;
    deleteItemFromList: (listId: string, itemId: string) => void;
    updateItemFromList: (
        listId: string,
        itemId: string,
        edit: Omit<ITodoItem, 'id'>,
    ) => void;
    setItemsToList: (listId: string, items: ITodoItem[]) => void;
    addItemsToList: (listId: string, items: ITodoItem[]) => void;
    deleteListFromLists: (listId: string) => void;
}

export const useMyLists = create<MyListsInterface>((set) => ({
    lists: [],
    setLists: (lists) => set(() => ({ lists })),
    addListToMyList: (list) =>
        set(({ lists }) => ({
            lists: [...lists, list],
        })),
    removeListFromMyLists: (listId) =>
        set(({ lists }) => ({
            lists: lists.filter(({ _id }) => _id !== listId),
        })),
    editListMeta: (listId, edit) =>
        set(({ lists }) => {
            const foundListIndex = lists.findIndex(
                (elem) => elem._id === listId,
            );
            const newLists = lists;
            newLists[foundListIndex].title = edit.title;
            newLists[foundListIndex].description = edit.description;
            return { lists: newLists };
        }),
    deleteItemFromList: (listId, itemId) =>
        set(({ lists }) => {
            const foundListIndex = lists.findIndex(
                (elem) => elem._id === listId,
            );
            const newItems = lists[foundListIndex].items.filter(
                (item) => item.id !== itemId,
            );
            lists[foundListIndex].items = newItems;
            return { lists };
        }),
    updateItemFromList: (listId, itemId, { title, description }) =>
        set(({ lists }) => {
            const foundListIndex = lists.findIndex(
                (elem) => elem._id === listId,
            );
            const indexItemUpdate = lists[foundListIndex].items.findIndex(
                (item) => item.id === itemId,
            );
            lists[foundListIndex].items[indexItemUpdate] = {
                id: itemId,
                title,
                description,
            };
            return { lists };
        }),
    setItemsToList: (listId, items) =>
        set(({ lists }) => {
            const foundIndexListId = lists.findIndex(
                (elem) => elem._id === listId,
            );
            lists[foundIndexListId].items = items;
            return { lists };
        }),
    addItemsToList: (listId, items) =>
        set(({ lists }) => {
            const foundListIndex = lists.findIndex(
                (elem) => elem._id === listId,
            );
            lists[foundListIndex].items.push(...items);
            return { lists };
        }),
    deleteListFromLists: (listId) =>
        set(({ lists }) => {
            lists = lists.filter((list) => list._id !== listId);
            return { lists };
        }),
}));
