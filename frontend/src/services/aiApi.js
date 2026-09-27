import { apiClient } from './api';

export const aiApi = {
  getStudyIntelligence: async (studyId) => {
    try {
      const response = await apiClient.get(`/ai/studies/${studyId}/overview`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching AI study intelligence:', error);
      throw error;
    }
  },

  generateAIExplanation: async (studyId) => {
    try {
      const response = await apiClient.post(`/ai/studies/${studyId}/explanation`);
      return response.data.data;
    } catch (error) {
      console.error('Error generating AI explanation:', error);
      throw error;
    }
  },

  askAI: async (studyId, question) => {
    try {
      const response = await apiClient.post(`/ai/studies/${studyId}/chat`, { question });
      return response.data.data;
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    }
  }
};
