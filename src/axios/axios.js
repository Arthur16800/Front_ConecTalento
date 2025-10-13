import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "http://10.89.240.71:5000/api/v1",
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
  getUserById: (id_user) => api.get(`/userId/${id_user}`),
  postLogin: (user) => api.post("/login", user),
  deleteUser: (id_user) => api.delete(`/user/${id_user}`),
  getByUsername: (username) => api.get(`/user/${username}`),

  updateUser: (id_user, user) => {
    const isForm = typeof FormData !== "undefined" && user instanceof FormData;
    const config = {
      headers: {
        ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
        Accept: "application/json",
      },
    };
    return api.put(`/user/${id_user}`, user, config);
  },

  updateImgUser: (id_user, img) => {
    const data = new FormData();
    for (let key in img) {
      data.append(key, img[key]);
    }

    if (img) {
      for (let i = 0; i < img.length; i++) {
        data.append("imagens", img[i]);
      }
    }

    return api.put(`/user/img/${id_user}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

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

  updateProjeto: (ID_projeto, { titulo, descricao, ID_user }, imagens) => {
    const data = new FormData();

    data.append("titulo", titulo);
    data.append("descricao", descricao);
    data.append("ID_user", ID_user);

    if (imagens) {
      for (let i = 0; i < imagens.length; i++) {
        data.append("imagens", imagens[i]);
      }
    }

    return api.put(`/project/${ID_projeto}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

  // Get project details including imagens array
  getProjectDetails: (id) => api.get(`/detalhes_project/${id}`),
};

export default sheets;
