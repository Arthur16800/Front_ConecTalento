import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "http://10.89.240.134:5000/api/v1",
  headers: { accept: "application/json" },
});

// Adiciona token se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepta erros de auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if ((error.response.status === 401 || error.response.status === 403) && error.response.data.auth === false) {
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
  // Usuário
  postCadastro: (user) => api.post("/user", user),
  postValidateCode: (user) => api.post("/user/validatecode", user),
  getUserById: (id) => api.get(`/user/${id}`),
  postLogin: (user) => api.post("/login", user),
  updateUser: (user) => api.post("/login", user),

  // Projeto
  createProjeto: (ID_user, form, imagens) => {
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (imagens) {
      for (let i = 0; i < imagens.length; i++) data.append("imagens", imagens[i]);
    }
    return api.post(`/project/${ID_user}`, data, {
      headers: { "Content-Type": "multipart/form-data", Accept: "application/json" },
    });
  },

  // Projetos
  getAllProjects: () => api.get("/projects"),
  getAllProjectsOrderByLikes: () => api.get("/projects?order=likes"),
  
  // Curtidas
  likeProject: (ID_projeto, id_usuario) => api.post("/project/like", { ID_projeto: Number(ID_projeto), id_usuario: Number(id_usuario) }),
};

export default sheets;
