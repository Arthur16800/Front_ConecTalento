import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "http://10.89.240.65:5000/api/v1",
  headers: {
    accept: "application/json",
  },
});

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
  postLogin: (user) => api.post("/login", user),
  createProjeto: (form, imagens) => {
    const data = new FormData();

    // adiciona campos do formulário
    for (let key in form) {
      data.append(key, form[key]);
    }

    // adiciona arquivos, um por um
    if (imagens) {
      for (let i = 0; i < imagens.length; i++) {
        data.append("imagens", imagens[i]); // note o [] se o backend espera múltiplos
      }
    }

    return api.post("/project", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },
};

export default sheets;
