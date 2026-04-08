import api from './api'

export const reportService = {
  async getExpensesByCategory(startDate, endDate) {
    const params = {};
    if (startDate && startDate !== 'undefined') params.startDate = startDate;
    if (endDate && endDate !== 'undefined') params.endDate = endDate;

    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/reports/expenses-by-category${queryString ? `?${queryString}` : ''}`);
    return response.data.data;
  },

  async getMonthlySummary(year, month) {
    const response = await api.get(`/reports/monthly-summary?year=${year}&month=${month}`);
    return response.data.data;
  },

  async getFinancialHealth() {
    const response = await api.get('/reports/financial-health');
    return response.data.data;
  },
}