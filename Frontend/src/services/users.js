import axios from "../apiConnection.js"

class UserApi {

    login(data) {
        return axios.post("/user/login", data)
    }

    signup(data) {
        const selectedLanguage = localStorage.getItem("selectedLanguage");
        const language = selectedLanguage !== null ? selectedLanguage : "es";
        const headers = {
            lang: language
        };
        const config = {
            headers: headers
        };
        return axios.post("/user/signup",data, config)
    }

    requestPasswordReset(data) {
        return axios.post("/user/requestpasswordreset",data)
    }

    resetPassword(data) {
        return axios.post("/user/passwordreset",data)
    }

    verify(){
        return axios.get("/user/verify",{
            headers: {
                "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
            }
        })
    }

    getSkin(){
        return axios.get("/user/skin",{
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