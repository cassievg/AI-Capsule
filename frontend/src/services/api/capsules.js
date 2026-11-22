import instance from "../../libs/request";

const getCpsls = async () => {
    const res = await instance.get('/capsules');
    return res.data;
};

const getCpslById = async (id) => {
    const res = await instance.get(`/capsules/${id}`);
    return res.data;
};

const addCpsl = async (cpsl) => {
    const res = await instance.post('/capsules', cpsl);
    return res.data;
};

const editCpsl = async (cpsl) => {
    const res = await instance.put(`/capsules/${cpsl.id}`, cpsl);
    return res.data;
};

const delCpsl = async (id) => {
    const res = await instance.delete(`/capsules/${id}`);
    return res.data;
};

export { getCpsls, getCpslById, addCpsl, editCpsl, delCpsl };
