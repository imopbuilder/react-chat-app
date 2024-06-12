import { create } from 'zustand';

type State = {
  chat: { email: string; message: string }[];
  members: { email: string; status: 'offline' | 'online'; messages?: { value: string; from: string }[] }[];
  selectedMembers: { email: string } | null;
};

type Action = {
  updateChat: (chat: State['chat']) => void;
  updateMembers: (member: State['members']) => void;
  addMember: (member: State['members'][number]) => void;
  updateSelectedMembers: (selectedMember: State['selectedMembers']) => void;
  addMemberChat: (members: State['members']) => void;
};

export const useChat = create<State & Action>((set) => ({
  chat: [],
  members: [],
  selectedMembers: null,
  updateChat: (chat) => set(() => ({ chat: chat })),
  updateMembers: (members) => set(() => ({ members: members })),
  addMember: (member) => set((state) => ({ ...state, members: [...state.members, member] })),
  updateSelectedMembers: (selectedMember) => set(() => ({ selectedMembers: selectedMember })),
  addMemberChat: (members) => set(() => ({ members: members })),
}));
