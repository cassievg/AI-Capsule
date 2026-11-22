import instance from "../../libs/request";

//temp
const login = async () => {
    window.location.href = 'https://ai-capsule-backend.onrender.com/api/auth/github';
};

const getUser = async () => {
    const res = await instance.get('/auth/me');
    return res.data;
};

export { login, getUser };
