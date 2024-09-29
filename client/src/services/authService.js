import axios from "axios";

const API_URL = 'http://localhost:3000/auth'

export const signUp = async (formData) => {
    await axios.post(API_URL, formData)
}
