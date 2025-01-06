import axios from "axios";

const baseURL = String(import.meta.env.VITE_URI);

const apiClient = axios.create({
    baseURL : baseURL,
    headers:{
        'Content-Type' : 'application/json'
    }
})

const handleApiResponse = (apiCall) => {
    return new Promise((resolve, reject) => {
        apiCall
            .then((res) => resolve(res.data))
            .catch((error) => {
                const errorMessage = error.response?.data?.message;
                if (errorMessage) reject(errorMessage);
                else reject("unknown error");
            });
    });
};

export const userLogin = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/user/get-started`, {...credentials} , {withCredentials:true})
);

export const logout = () => handleApiResponse(
    apiClient.post(`${baseURL}/user/logout` , {} , {withCredentials : true})
);

export const refreshAccesstoken = () => handleApiResponse(
    apiClient.post(`${baseURL}/user/refresh` , {} , {withCredentials : true})
);

export const getDetails = (slug) => handleApiResponse(
    apiClient.get(`${baseURL}/user/get-details/${slug}` ,  {withCredentials : true})
);

export const getCurrentUser = () => handleApiResponse(
    apiClient.get(`${baseURL}/user/current-user` ,  {withCredentials : true})
);

export const getUserDashboard = (slug) => handleApiResponse(
    apiClient.get(`${baseURL}/user/get-details/${slug}` ,  {withCredentials : true})
);

export const SubmitCode = (slug , credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/code/submit-code/${slug}` ,{...credentials} ,  {withCredentials : true})
);

export const testCode = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/code/testing-code` ,{...credentials} ,  {withCredentials : true})
);

export const updateDetails = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/user/update-details` ,{...credentials} ,  {withCredentials : true})
);

export const getCodes = () => handleApiResponse(
    apiClient.get(`${baseURL}/code/get-codes` ,  {withCredentials : true})
);

export const getCounts = () => handleApiResponse(
    apiClient.get(`${baseURL}/code/get-counts` ,  {withCredentials : true})
);

export const getQuestionById = (slug) => handleApiResponse(
    apiClient.get(`${baseURL}/code/question/${slug}` ,  {withCredentials : true})
);

export const getUsers = () => handleApiResponse(
    apiClient.get(`${baseURL}/user/get-users` ,  {withCredentials : true})
);




