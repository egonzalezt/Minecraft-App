import axios from "../apiConnection.js"

class AdminApi {

    uploadMod(data) {
        return axios.post("/downloadAudio", data, { responseType: 'blob' })
    }

    mods() {
        return axios.get("/mods")
    }

}

export default new AdminApi();