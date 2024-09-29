import axios from "axios";

const API_URL = 'http://localhost:3000'

export const signUp = async (formData) => {
    await axios.post(API_URL + '/signup', formData)
}

export const signIn = async (formData) => {
    await axios.post(API_URL + '/signin', formData)
}
