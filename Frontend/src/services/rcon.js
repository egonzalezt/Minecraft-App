import axios from "../apiConnection.js"

class RconApi {
    runCommand(cmd) {
        return axios.get("/commands/run/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                "Command": cmd
            }
        })
    }
}

export default new RconApi();