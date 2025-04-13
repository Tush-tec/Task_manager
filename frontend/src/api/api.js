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
    return apiClient.get('/user/auth/google')
}

const workerLogin = () => {
    return apiClient.get('/user/auth/callback')
}

const workerLogout = () => {
    return apiClient.get("/user/logout")
}


const registerWorker = (data) => {
    console.log("sending to API", data);
    
    return apiClient.post(`/user/register-worker`, data)
}

const loginWorker = (data) => {
    return apiClient.post(`/user/login-worker`, data)
}


//           Admin                //

const loginAdmin = () => {
    return apiClient.post("/admin/login");
};

const logoutAdmin = () => {
    return apiClient.post("/admin/logout");
};

const toggleRole = (workerId) => {
    return apiClient.patch(`/admin/toggle-role/${workerId}`);
};

const subAdmin = () => {
    return apiClient.get("/admin/get-subadmin");
};

const deleteAdmin = (workerId) => {
    return apiClient.delete(`/admin/delete-subAdmin/${workerId}`);
};


//               Worker                //


const getAllWorkerFromDB = () => {
    return apiClient.get(
        '/user/get-all-worker'
    )
}


const createTaskforUser = (data) => {
        return apiClient.post("/task/create-task", data)
}
    

const getAllTask = () =>{
    return apiClient.get("/task/get-all-task")
}

const getTaskById = (taskId) => {
    return apiClient.get(`/task/get-task/${taskId}`)
}

const getTaskforUser= (taskId) =>{
    return apiClient.get(`/task/get-task-indi/${taskId}`)
}


const updateTaskStatus= (taskId, status) => {
    return apiClient.patch(`/task/update-task-status/${taskId}`, status)

}

const updateTaskById = (taskId) => {
    return apiClient.patch(`/task/update-task-status/${taskId}`)
}
const updateTaskForUser= (taskId) =>{

    return apiClient.patch(`/task/update-task/${taskId}`)
}

const deleteTaskForUser = (taskId) => {
    return apiClient.delete(`/task/delete-task/${taskId}`)
}


export {
    workerLoginOrRegisterWithGoogle,
    workerLogin,
    workerLogout,
    loginAdmin,
    logoutAdmin,
    toggleRole,
    subAdmin,
    deleteAdmin,
    createTaskforUser,
    getAllTask,
    getTaskforUser,
    updateTaskForUser,
    updateTaskById,
    deleteTaskForUser,
    registerWorker,
    loginWorker,
    getAllWorkerFromDB,
    getTaskById,
    updateTaskStatus


    
}