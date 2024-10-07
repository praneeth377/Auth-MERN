import axios from "axios";

function getToken() {
    const persistRoot = localStorage.getItem('persist:resist');
    if (persistRoot) {
      const { currentUser } = JSON.parse(persistRoot);
      if (currentUser) {
        const user = JSON.parse(currentUser);
        console.log(user.token)
        return user.token;
      }
    }
    return null;
}

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      clg(token)
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export const update = async (id, inputData) => {
    const res = await api.post(`http://localhost:3000/update/${id}`, inputData)
    return res
}
