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

    verifyIfModsExists(mods) {
        return axios.post('/admin/mods/verify', { mods }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        });
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

    getServerProperties() {
        return axios.get('/admin/server/edit/serverprops', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    getModsProperties() {
        return axios.get('/admin/server/edit/modsprops', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    getModProperties(filename) {
        return axios.get(`/admin/server/edit/modprops?filename=${filename}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    updateServerProperties(properties) {
        return axios.post('/admin/server/edit/serverprops', { properties:properties }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        });
    }

    updateModProperties(name,path,properties) {
        return axios.post('/admin/server/edit/modprops', { name,path,properties }, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        });
    }
}

export default new AdminApi();