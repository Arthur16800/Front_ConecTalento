import axios from "axios";

const api = axios.create({
  baseURL: "http://10.89.240.74:5000/api/v1",
  headers: { accept: "application/json" },
});

// --- 🔒 Função para atualizar o token ---
async function refreshToken() {
  const storedRefreshToken = localStorage.getItem("refresh_token");
  if (!storedRefreshToken) throw new Error("Sem refresh token");

  const res = await axios.post(
    "http://10.89.240.74:5000/api/v1/token/refresh",
    {
      refreshToken: storedRefreshToken,
    }
  );

  const newToken = res.data.token;
  const newRefresh = res.data.refreshToken;

  localStorage.setItem("token", newToken);
  if (newRefresh) localStorage.setItem("refresh_token", newRefresh);

  return newToken;
}

// --- Adiciona token nas requisições ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Intercepta erros de autenticação ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 e ainda não tentamos atualizar
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Espera o refresh terminar
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        isRefreshing = false;
        processQueue(null, newToken);

        // Reenvia a requisição original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);

        console.warn("Falha ao renovar token. Forçando logout seguro.");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("authenticated");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// --- Suas rotas ---
const sheets = {
  postCadastro: (user) => api.post("/user", user),
  postValidateCode: (user) => api.post("/user/validatecode", user),
  getUserById: (id) => api.get(`/user/${id}`),
  postLogin: (user) => api.post("/login", user),
  updateUser: (user) => api.post("/login", user),

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

  getAllProjects: () => api.get("/projects"),
  getAllProjectsOrderByLikes: () => api.get("/projects?order=likes"),
  likeProject: (ID_projeto, ID_user) =>
    api.post("/project/like", {
      ID_projeto: Number(ID_projeto),
      ID_user: Number(ID_user),
    }),
};

export default sheets;
