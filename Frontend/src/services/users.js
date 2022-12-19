import axios from "../apiConnection.js"

class UserApi {

    login(data) {
        return axios.post("/user/login", data)
    }

    signup(data) {
        return axios.post("/user/signup",data)
    }

    verify(){
        return axios.get("/user/verify",{
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    logOut(){
        return axios.delete("/user/logout",{
            headers: {
                "refreshtoken": localStorage.getItem("refreshToken")
            }
        });
    }

}

export default new UserApi();