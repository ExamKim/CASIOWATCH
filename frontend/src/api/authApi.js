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

    updateProfile(payload) {
        // payload: { username, phone, address }
        return axiosClient.put("/users/profile", payload).then((res) => res.data);
    },

    changePassword(payload) {
        // payload: { currentPassword, newPassword }
        return axiosClient.put("/users/change-password", payload).then((res) => res.data);
    },
};