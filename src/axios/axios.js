import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "http://10.89.240.65:5000/api/v1",
  headers: {
    accept: "application/json",
  },
});

// Interceptador de request → adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de response → trata erros de auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && error.response.data.auth === false) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("token");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
      } else if (
        error.response.status === 403 &&
        error.response.data.auth === false
      ) {
        localStorage.setItem("refresh_token", true);
        localStorage.removeItem("token");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

const sheets = {
  postCadastro: (user) => api.post("/user", user),
  postValidateCode: (user) => api.post("user/validatecode", user),
  getUserById: (id) => api.get("/user/" + id),
  postLogin: (user) => api.post("/login", user),
  updateUser: (user) => api.post("/login", user),

  createProjeto: (ID_user, form, imagens) => {
    const data = new FormData();

    for (let key in form) {
      data.append(key, form[key]);
    }

    if (imagens) {
      for (let i = 0; i < imagens.length; i++) {
        data.append("imagens", imagens[i]);
      }
    }

    return api.post(`/project/${ID_user}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },
};

export default sheets;
