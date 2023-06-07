import axios from "../apiConnection.js"

class AdminApi {
    upload(formData, config) {
        return axios.post("/admin/mods", formData, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data'
            },
            ...config
        });
    }
    
    mods(page, pageSize) {
        return axios.get(`/admin/mods?page=${page}&limit=${pageSize}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    verifyIfModExists(filename) {
        return axios.get(`/admin/mods/verify?name=${filename}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    createZip() {
        return axios.get('/admin/mods/create', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    deleteMods(data) {
        return axios.delete("/admin/mods", {
            data: { mods: data },
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    }

}

export default new AdminApi();