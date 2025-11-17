import { create } from 'zustand';

export const useBatchStore = create((set) => ({
  name: '',
  description: '',
  logoImage: null,
  bannerImage: null,

  setField: (field, value) => set({ [field]: value }),
  resetForm: () => {
    set({
      name: '',
      description: '',
      logoImage: null,
      bannerImage: null,
    });
  },
}));