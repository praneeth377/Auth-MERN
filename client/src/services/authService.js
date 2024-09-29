import axios from "axios";

const API_URL = 'http://localhost:3000'

export const signUp = async (formData) => {
    const res = await axios.post(API_URL + '/signup', formData)
    return res
}

export const signIn = async (formData) => {
    const res = await axios.post(API_URL + '/signin', formData)
    return res
}
