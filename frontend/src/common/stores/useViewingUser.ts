import create from 'zustand';

interface ViewingUser {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profileEmoji: string | null;
}

interface ViewingUserStoreInterface {
    viewingUser: ViewingUser | null;
    setViewingUser: (newUser: ViewingUser | null) => void;
}

export const useViewingUser = create<ViewingUserStoreInterface>((set) => ({
    viewingUser: null,
    setViewingUser: (newUser) => set((state) => ({ viewingUser: newUser })),
}));
