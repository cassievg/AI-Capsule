import instance from "../../libs/request";

//temp
const login = async () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
};

const getUser = async () => {
    const res = await instance.get('/auth/me');
    return res.data;
};

export { login, getUser };
