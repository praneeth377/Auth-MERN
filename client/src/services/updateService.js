import axios from "axios";

const API_URL = 'http://localhost:3000'

export const update = async (id) => {
    const res = await axios.post(API_URL + '/user' + `/${id}`)
    return res
}
