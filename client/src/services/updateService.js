import axios from "axios";

const API_URL = 'http://localhost:3000'

export const update = async (id, inputData) => {
    const res = await axios.post(API_URL + `/update/${id}`, inputData, { withCredentials: true })
    return res
}
