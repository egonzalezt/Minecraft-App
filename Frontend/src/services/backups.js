import axios from "../apiConnection.js"

class AdminApi {

    backups(page, pageSize) {
        return axios.get(`/backups/backups?page=${page}&limit=${pageSize}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    createBackup() {
        return axios.get('/backups/generate', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    deleteBackups(data) {
        return axios.delete("/backups", {
            data: { backups: data },
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    downloadBackup(id, onProgress) {
        return axios.get(`/backups/download/${id}`, {
            responseType: 'blob',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            onDownloadProgress: onProgress
        });
    }
}

export default new AdminApi();