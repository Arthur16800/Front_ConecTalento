import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "http://192.168.100.6:5000/api/v1",
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
  // 🧍 Usuário
  postCadastro: (user) => api.post("/user", user),
  postValidateCode: (user) => api.post("/user/validatecode", user),
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

  updatePassword: (id_user, senhas) =>
    api.put(`/user/newpassword/${id_user}`, senhas),

  // 📁 Projetos
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

  // 🔧 Mantido para casar com: router.put("/project/:id", verifyJWT, upload.array("imagens"), ...)
  // O back exige multipart/form-data com a chave "imagens" SEMPRE presente.
  updateProjeto: (ID_projeto, formData) => {
    return api.put(`/project/${ID_projeto}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },

  getProjectDetails: (id) => api.get(`/projectdetail/${id}`),
  getAllProjects: () => api.get("/projects"),
  getAllProjectsOrderByLikes: () => api.get("/projects?order=likes"),
  updateExtrainfo: (ID_user, redes) => api.put(`/extrainfo/${ID_user}`, redes),

  likeProject: (projectId, userId) => {
    if (!projectId || !userId) {
      return Promise.reject(new Error("Project ID ou User ID ausente"));
    }
    return api.post("/like_dislike_projects", {
      ID_projeto: Number(projectId),
      ID_user: Number(userId),
    });
  },

  getProjectsLikedUser: (userId) => {
    if (!userId) return Promise.reject(new Error("User ID ausente"));
    return api.get(`/projectsliked/${userId}`);
  },

  getProjectsByUserName: (username) => api.get(`/projects/${username}`),
};

export default sheets;