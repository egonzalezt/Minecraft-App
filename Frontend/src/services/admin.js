import axios from "../apiConnection.js"

class AdminApi {
    uploadMod(data) {
        return axios.post("/admin/downloadAudio", data, { responseType: 'blob' })
    }

    mods(page, pageSize) {
        return axios.get(`/admin/mods?page=${page}&limit=${pageSize}`,{
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

}

export default new AdminApi();