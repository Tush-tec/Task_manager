import axios from "axios"


const apiClient  = axios.create(
    {
        baseURL: 'http://localhost:6080/',
        withCredentials:true,
        timeout: 120000
    }
)

apiClient.interceptors.request.use(
    function (config){
        const token = localStorage.getItem("token")
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)



const workerLoginOrRegisterWithGoogle = () => {
    return apiClient.post('/user/auth/google')
}


export {
    workerLoginOrRegisterWithGoogle
    
}