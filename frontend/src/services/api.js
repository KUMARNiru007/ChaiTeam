import { axiosInstance } from '../lib/axios';

// Batch API services
export const batchService = {
  getUserBatches: async () => {
    try {
      const response = await axiosInstance.get('/batch/my-batches');
      if (!response.data || !response.data.Data) {
        throw new Error('Invalid response format');
      }
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching batches:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  getAllBatches: async () => {
    try {
      const response = await axiosInstance.get('/batch/all');
      if (!response.data || !response.data.Data) {
        throw new Error('Invalid response format');
      }
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching batches:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  getBatchById: async (batchId) => {
    try {
      const response = await axiosInstance.get(
        `/batch/getBatchById/${batchId}`,
      );
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching batch details:', error);
      throw error;
    }
  },
  createBatch: async (payload) => {
    try {
      const response = axiosInstance.post('/batch/create', payload);
      // console.log('Batch Create Data: ', response);
    } catch (error) {
      console.error('Error while creating the Batch: ', error);
      throw error;
    }
  },

  uploadBatchCSV: async (batchId, payload) => {
    try {
      const response = await axiosInstance.post(
        `/batch/upload-csv/${batchId}`,
        payload,
      );
      // console.log('Upload Result: ', response);
    } catch (error) {
      console.error('error while uploading students Data: ', error);
      throw error;
    }
  },

  deleteBatch: async (batchId) => {
    try {
      const response = await axiosInstance.delete(
        `/batch/deleteBatch/${batchId}`,
      );
      return response.data.Data;
    } catch (error) {
      console.error('error while deleting the Batch: ', error);
      throw error;
    }
  },

  updateBatch: async (batchId, payload) => {
    try {
      const response = await axiosInstance.put(
        `/batch/updateBatch/${batchId}`,
        payload,
      );
      return response.data.Data;
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  },
};

// Groups API services
export const groupService = {
  getAllGroups: async () => {
    try {
      const response = await axiosInstance.get('/groups/getAllGroups');
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching groups:', error);
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
      const response = await axiosInstance.get(
        `/groups/getAllGroups?batchId=${batchId}`,
      );
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching batch groups:', error);
      throw error;
    }
  },

  getGroupById: async (groupId) => {
    try {
      const response = await axiosInstance.get(
        `/groups/getGroupById/${groupId}`,
      );
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  },

  getGroupActivity: async (groupId) => {
    try {
      const response = await axiosInstance.post('/activity/GroupActivity', {
        groupId,
      });
      // console.log('Group Activity: ', response.data);
      return response.data.Data;
    } catch (error) {
      console.error('Error while fetching the Group Activity: ', error);
      throw error;
    }
  },

  getGroupNotices: async (groupId) => {
    try {
      const response = await axiosInstance.get(
        `/noticeboard/getGroupNotices/${groupId}`,
      );
      // console.log('Group Noticeboard: ', response.data);
      return response.data.Data;
    } catch (error) {
      console.error('error while fethcing the Group Notices: ', error);
      throw error;
    }
  },

  applyToJoinGroup: async (groupId, reason) => {
    try {
      const response = await axiosInstance.post(
        `/groups/applyToJoinGroup/${groupId}`,
        { reason },
      );
      console.log('Application Data: ', response.data.Data);
    } catch (error) {
      console.error('Error while send application to join the group: ', error);
      throw error;
    }
  },

  getAllJoinApplications: async (groupId) => {
    try {
      const response = await axiosInstance.get(
        `/groups/allApplications/${groupId}`,
      );
      // console.log('All Applications: ', response.data.Data);
      return response.data.Data;
    } catch (error) {
      console.error('Error while fetching group join Applications: ', error);
      throw error;
    }
  },

  rejectApplication: async (groupId, userId) => {
    try {
      const response = await axiosInstance.post(
        `/groups/rejectApplication/${groupId}`,
        { userId },
      );
    } catch (error) {
      console.error('error while rejecting the Application: ', error);
      throw error;
    }
  },

  addMemberToGroup: async (groupId, userId, name, email) => {
    try {
      const response = await axiosInstance.post(
        `/groups/addMemberToGroup/${groupId}`,
        { userId, name, email },
      );
      console.log('Added Member: ', response.data.Data);
    } catch (error) {
      console.error('Error while adding user to the group: ', error);
      throw error;
    }
  },
};

// Notice API services
export const noticeService = {
  getGlobalNotices: async () => {
    try {
      const response = await axiosInstance.get('/noticeboard/getGlobalNotices');
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching global notices:', error);
      throw error;
    }
  },

  getBatchNotices: async (batchId) => {
    try {
      const response = await axiosInstance.get(
        `/noticeboard/getBatchNotices/${batchId}`,
      );
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching batch notices:', error);
      throw error;
    }
  },

  getNoticesByScope: async (scope) => {
    try {
      const response = await axiosInstance.get(`/notices?scope=${scope}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching notices by scope:', error);
      throw error;
    }
  },

  getNoticeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/notices/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching notice:', error);
      throw error;
    }
  },

  createNotice: async (noticeData) => {
    try {
      const response = await axiosInstance.post('/notices', noticeData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  },

  updateNotice: async (id, noticeData) => {
    try {
      const response = await axiosInstance.put(`/notices/${id}`, noticeData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  },

  deleteNotice: async (id) => {
    try {
      const response = await axiosInstance.delete(`/notices/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error deleting notice:', error);
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

// User API services
export const userService = {
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response.data.Data || response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/user/allUsers');
      // console.log('Usesr Reposne: ', response.data.Data);
      return response.data.Data;
    } catch (error) {
      console.error('Error while fetching all Users: ', error);
      throw error;
    }
  },

  updateRole: async (payload) => {
    try {
      const response = await axiosInstance.post('/user/updateRole', {
        userId: payload,
      });
      // console.log('Update Response: ', response);
      return response.data;
    } catch (error) {
      console.error('Error while updating the User Role: ', error);
      throw error;
    }
  },

  getUserActivity: async (userId) => {
    try {
      const response = await axiosInstance.post('/activity/UserActivity', {
        userId,
      });
      return response.data.Data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  },
};
