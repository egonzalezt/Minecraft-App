import axios from "axios";
import Swal from 'sweetalert2'
 
const baseUrl = "/api/v1/"
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
  }
});

async function refresh_token() {
  let refreshTk = await localStorage.getItem("refreshToken")
  return axios.post(`${baseUrl}user/refresh`, {
    refreshToken: refreshTk,
  })
}

axiosInstance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const config = error.config;
  if (error.response && error.response.status === 401 && !config._retry) {
    config._retry = true;
    try {
      let refreshing_token = refresh_token();
      let res = await refreshing_token;
      refreshing_token = null;
      if (res.data['accessToken']) {
        const access_token = res.data['accessToken'];
        localStorage.setItem('accessToken', access_token);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${access_token}`
        config.headers["Authorization"] = `Bearer ${access_token}`
      }
      return axiosInstance(config);
    } catch (err) {
      const refresh_token = localStorage.getItem('refreshToken');
      if(refresh_token !== "" && refresh_token !== undefined && refresh_token !== null){
        Swal.fire({
          icon: 'error',
          title: 'La sesion se ha cerrado',
          footer: '<a href="/login">Inicia sesion nuevamente</a>',
          allowEscapeKey: false,
        }).then(function () {
          localStorage.setItem('accessToken', "");
          localStorage.setItem('refreshToken', "");
          window.location = "/login";
        });
      }
      return Promise.reject(err)
    }
  }
  return Promise.reject(error)
});

export default axiosInstance