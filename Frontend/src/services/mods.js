import axios from "../apiConnection.js"

class ModsApi {
    downloadMod(id) {
        return axios.get(`/mods/download/mod/${id}`, {
            responseType: 'blob', 
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }
}

export default new ModsApi();