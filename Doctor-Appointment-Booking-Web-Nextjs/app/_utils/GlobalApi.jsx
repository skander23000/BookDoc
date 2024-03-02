const { default: axios } = require("axios");

const API_KEY = process.env.NEXT_PUBLIC_STRAPI_API_KEY;

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

const uploadImage = (image) => axiosClient.post("/upload", image);
const registerUser = (userData) => axiosClient.post("/users", userData);
const registerDoctor = (userData) =>
  axiosClient.post("/doctors", { data: userData });

const checkUserExists = (email) =>
  axiosClient.get(
    `/users?filters[email][$eq]=${encodeURIComponent(email)}&populate=role`
  );

const getUserByEmail = (email) =>
  axiosClient
    .get(
      `/users?filters[email][$eq]=${encodeURIComponent(email)}&populate=role`
    )
    .then((response) => {
      if (response.data && response.data.length > 0) {
        return response.data[0]; // Retourne le premier utilisateur correspondant
      }
      throw new Error("Utilisateur non trouvé");
    });
const getDoctorByEmail = (email) =>
  axiosClient
    .get(`/doctors?filters[email][$eq]=${encodeURIComponent(email)}&populate=*`)
    .then((response) => {
      if (response.data && response.data.data.length > 0) {
        return response.data.data[0]; // Retourne le premier docteur correspondant
      }
      throw new Error("Docteur non trouvé");
    });

const updateDoctor = (id, updateData) =>
  axiosClient
    .put(`/doctors/${id}`, { data: updateData })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // Gestion de l'erreur
      throw new Error(
        "Erreur lors de la mise à jour du docteur: " + error.message
      );
    });

const updateUserRole = (id, role) =>
  axiosClient.put(`/users/${id}`, {
    role: role,
  });

const getCategory = () => axiosClient.get("/categories?populate=*");

const getDoctorList = () => axiosClient.get("/doctors?populate=*");

const getDoctorByCategory = (category) =>
  axiosClient.get(
    `/doctors?filters[categories][Name][$in]=${encodeURIComponent(
      category
    )}&populate=*`
  );

const getDoctorById = (id) => axiosClient.get("/doctors/" + id + "?populate=*");

const bookAppointment = (data) => axiosClient.post("/appointments", data);

const getDoctorBookingList = (doctorName) =>
  axiosClient.get(
    `/appointments?filters[doctor][name][$eq]=${encodeURIComponent(
      doctorName
    )}&populate=doctor`
  );

const getUserBookingList = (userEmail) =>
  axiosClient.get(
    "/appointments?[filters][Email][$eq]=" +
      userEmail +
      "&populate[doctor][populate][image][populate][0]=url&populate=*"
  );

const deleteBooking = (id) => axiosClient.delete("/appointments/" + id);

const sendEmail = (data) => axios.post("/api/sendEmail", data);
export default {
  uploadImage,
  registerUser,
  registerDoctor,
  checkUserExists,
  updateUserRole,
  updateDoctor,
  getUserByEmail,
  getDoctorByEmail,
  getCategory,
  getDoctorList,
  getDoctorByCategory,
  getDoctorById,
  bookAppointment,
  getDoctorBookingList,
  getUserBookingList,
  deleteBooking,
  sendEmail,
};
