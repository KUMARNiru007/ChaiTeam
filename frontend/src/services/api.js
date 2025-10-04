import { axiosInstance } from "../lib/axios";

// Batch API services
export const batchService = {
  getAllBatches: async () => {
    try {
      const response = await axiosInstance.get("/batch/my-batches");
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching batches:", error);
      throw error;
    }
  },

  getBatchById: async (batchId) => {
    try {
      const response = await axiosInstance.get(`/batch/getBatchById/${batchId}`);
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching batch details:", error);
      throw error;
    }
  },
};

// Groups API services
export const groupService = {
  getAllGroups: async () => {
    try {
      const response = await axiosInstance.get("/groups/getAllGroups");
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  },

  getUserGroup: async (batchId) => {
    try {
      const response = await axiosInstance.get(`/user/getUserGroup/${batchId}`);
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching user's group:", error);
      throw error;
    }
  },
  
  getBatchGroups: async (batchId) => {
    try {
      if (!batchId) {
        throw new Error('Batch ID is required');
      }
      const response = await axiosInstance.get(`/groups/getAllGroups?batchId=${batchId}`);
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching batch groups:", error);
      throw error;
    }
  },

  getGroupById: async (groupId) => {
    try {
      const response = await axiosInstance.get(`/groups/getGroupById/${groupId}`);
      return response.data.Data;
    } catch (error) {
      console.error("Error fetching group details:", error);
      throw error;
    }
  },
};

// Notice API services
export const noticeService = {
  getGlobalNotices: async () => {
    try {
      const response = await axiosInstance.get("/noticeboard/getGlobalNotices");
      return response.data.Data || response.data;
    } catch (error) {
      console.error("Error fetching global notices:", error);
      throw error;
    }
  },

  getNoticesByScope: async (scope) => {
    try {
      const response = await axiosInstance.get(`/notices?scope=${scope}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching notices by scope:", error);
      throw error;
    }
  },

  getNoticeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/notices/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching notice:", error);
      throw error;
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await axiosInstance.post("/notices", noticeData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error creating notice:", error);
      throw error;
    }
  },

  updateNotice: async (id, noticeData) => {
    try {
      const response = await axiosInstance.put(`/notices/${id}`, noticeData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error updating notice:", error);
      throw error;
    }
  },

  deleteNotice: async (id) => {
    try {
      const response = await axiosInstance.delete(`/notices/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error deleting notice:", error);
      throw error;
    }
  },
};

// Auth API services
export const authService = {
  googleLogin: () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`;
  },
  githubLogin: () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/github`;
  },
};
