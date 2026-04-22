import axiosClient from "./axiosClient";

export const authApi = {
    register(payload) {
        // payload: { username, email, password, phone, address }
        return axiosClient.post("/auth/register", payload).then((res) => res.data);
    },

    login(payload) {
        // payload: { email, password }
        return axiosClient.post("/auth/login", payload).then((res) => res.data);
    },

    me() {
        return axiosClient.get("/users/me").then((res) => res.data);
    },
};