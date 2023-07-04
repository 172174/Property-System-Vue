import axios from "axios";
import router from "./router";
import ElementUI from "element-ui";
axios.defaults.baseURL = "http://42.193.157.7:8199"
// axios.defaults.baseURL = "http://192.168.123.182:8099"

const request = axios.create({
    timeout: 5000,
    headers: {
        'content-Type': "application/json;charset=utf-8"
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("v2-token")
    return config
})

request.interceptors.response.use(response => {

        let res = response.data
        if (res.code === 200) {
            return response
        }else if(res.code === 401){
            ElementUI.Message.error(!res.msg ? "系统异常" : res.msg)
            this.localStorage.removeItem("token")
            router.push("/login")
        }
        else {
            ElementUI.Message.error(!res.msg ? "系统异常" : res.msg)
            return Promise.reject(response.data.msg)
        }
    }, error => {

            error.Message = error.response.data.msg+""

        if (error.response.data.code === 401) {
            console.log(error.Message)
            this.localStorage.removeItem("v2-token")
            router.push("/login")
        }


        ElementUI.Message.error(error.Message, { duration: 3000 })

        return Promise.reject(error)
    }


)

export default request