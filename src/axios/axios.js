import axios from "axios";

// === Configuração base do axios ===
const api = axios.create({
  baseURL: "http://10.89.240.74:5000/api/v1",
  headers: { accept: "application/json" },
});

// === Adiciona token em cada requisição ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Aqui enviamos apenas o token puro, sem "Bearer "
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === 🚀 Rotas da API ===
const sheets = {
  // --- Usuário ---
  postCadastro: (user) => api.post("/user", user),
  postValidateCode: (user) => api.post("/user/validatecode", user),
  getUserById: (id) => api.get(`/user/${id}`),
  postLogin: (user) => api.post("/login", user),
  updateUser: (user) => api.post("/login", user),

  // --- Projetos ---
  createProjeto: (ID_user, form, imagens) => {
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (imagens) {
      for (let i = 0; i < imagens.length; i++)
        data.append("imagens", imagens[i]);
    }
    return api.post(`/project/${ID_user}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

  // --- Listagem de projetos ---
  getAllProjects: () => api.get("/projects"),
  getAllProjectsOrderByLikes: () => api.get("/projects?order=likes"),

  // --- Curtidas ---
 // --- Curtidas ---
likeProject: (ID_projeto, ID_user) =>
  api.post("/like_dislike_projects", { ID_projeto, ID_user }),

// === NOVO ===
getProjectsLikedUser: (ID_user) =>
  api.get(`/projectsliked/${ID_user}`),

};

export default sheets;
