import api from './api'

export const transactionService = {
    async getAll(filters = {}) {
        // Remover undefined values
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== 'undefined') {
                cleanFilters[key] = filters[key];
            }
        });

        const params = new URLSearchParams(cleanFilters).toString();
        const response = await api.get(`/transactions${params ? `?${params}` : ''}`);
        return response.data.data;
    },

    async create(data) {
        const response = await api.post('/transactions', data);
        return response.data.data;
    },

    async update(id, data) {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data.data;
    },

    async delete(id) {
        await api.delete(`/transactions/${id}`);
    },

    async getBalance(startDate, endDate) {
        const params = {};
        if (startDate && startDate !== 'undefined') params.startDate = startDate;
        if (endDate && endDate !== 'undefined') params.endDate = endDate;

        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/transactions/balance${queryString ? `?${queryString}` : ''}`);
        return response.data.data;
    },
}