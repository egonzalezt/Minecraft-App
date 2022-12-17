import axios from "axios";

export default axios.create({
  baseURL: "/admin/",
  headers: {
    "Content-type": "application/json",
  }
});