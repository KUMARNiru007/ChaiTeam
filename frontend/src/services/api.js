import { axiosInstance } from '../lib/axios';

// Batch API services
export const batchService = {
  getAllBatches: async () => {
    try {
      const response = await axiosInstance.get('/batch/all');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }
};

// Groups API services
export const groupService = {
  getAllGroups: async () => {
    try {
      const response = await axiosInstance.get('/groups/getAllGroups');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }
};

// Notice API services
export const noticeService = {
  getGlobalNotices: async () => {
    try {
      const response = await axiosInstance.get('/noticeboard/getGlobalNotices');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global notices:', error);
      throw error;
    }
  },
  getBatchNotices: async (batchId) => {
    try {
      const response = await axiosInstance.get(`/noticeboard/getBatchNotices/${batchId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching batch notices:', error);
      throw error;
    }
  },
  getGroupNotices: async (groupId) => {
    try {
      const response = await axiosInstance.get(`/noticeboard/getGroupNotices/${groupId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching group notices:', error);
      throw error;
    }
  }
};