import instance from "../../libs/request";

const getCpsl = async () => {
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

const delCpsl = async (cpsl) => {
    const res = await instance.delete(`/capsules/${cpsl.id}`);
    return res.data;
};

export { getCpsl, getCpslById, addCpsl, editCpsl, delCpsl };
