import { create } from 'zustand';

export const useBatchStore = create((set) => ({
  name: '',
  description: '',
  logoImage: null,
  bannerImage: null,

  setField: (filed, value) => set({ [filed]: value }),
  resetForm: () => {
    set({
      name: '',
      description: '',
      logoImage: null,
      bannerImage: null,
    });
  },
}));
