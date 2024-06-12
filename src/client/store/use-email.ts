import { create } from 'zustand';

type State = {
  email: string;
};

type Action = {
  updateEmail: (email: State['email']) => void;
};

export const useEmail = create<State & Action>((set) => ({
  email: '',
  updateEmail: (email) => set(() => ({ email: email })),
}));
