import axios from 'axios'
import store from '@/store/store'

export default () => {
    return axios.create({
        baseURL: process.env.devServer.proxy,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "*/*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Origin, Content-Type, x-access-token",
            "x-access-token": `${store.state.token}`
        }
    })
}