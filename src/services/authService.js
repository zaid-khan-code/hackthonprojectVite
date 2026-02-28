import api from "./api";

export const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response.data.data;
};

export const getLoggedInUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem("user");
};
