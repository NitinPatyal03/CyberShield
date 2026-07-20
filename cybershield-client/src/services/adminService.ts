import axios from "axios";

const API = axios.create({
    baseURL: "https://localhost:7024/api"
});

API.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getUsers = () => API.get("/admin/users");

export const getDashboard = () => API.get("/admin/dashboard");

export const blockUser = (id:string)=>
    API.put(`/admin/users/${id}/block`);

export const unblockUser = (id:string)=>
    API.put(`/admin/users/${id}/unblock`);

export const deleteUser = (id:string)=>
    API.delete(`/admin/users/${id}`);

export const makeAdmin = (id:string)=>
    API.put(`/admin/users/${id}/make-admin`);

export const makeUser = (id:string)=>
    API.put(`/admin/users/${id}/make-user`);