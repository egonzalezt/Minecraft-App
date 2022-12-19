// store/index.js
import create from 'zustand';

const useStore = create(set => ({
    user: {},
    addUser: data =>
        set({
            user: data
        }),
    removeUser: () =>
        set(() => ({
            user: {}
        })),
}));

export const storeData = useStore;