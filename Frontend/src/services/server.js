import axios from "../apiConnection.js"

class ServerApi {

    getServerInfo(){
        return axios.get("/server",{
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

}

export default new ServerApi();