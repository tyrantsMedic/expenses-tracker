import axios from "axios";

const apiService = {
    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    // Generic GET request
    get(resource) {
        return axios.get(resource);
    },

    // Generic POST request
    post(resource, data) {
        return axios.post(resource, data);
    },

    // Generic PUT request
    put(resource, data) {
        return axios.put(resource, data);
    },

    // Generic DELETE request
    delete(resource, id) {
        return axios.delete(resource, { data: { id: id } });
    },

    // Error handling
    handleError(error) {
        console.error("API Service Error:", error);
        throw error; // Optionally rethrow the error for further handling
    },
};

export default apiService;
