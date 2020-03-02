import axios from 'axios'
import { stringify } from 'qs'
import { Toast } from 'mand-mobile'
import store from '../store/index.js'

let tmpTrip = store.state.trip

axios.defaults.timeout = 10000 //请求超时设置
axios.defaults.withCredentials = false

axios.interceptors.request.use(
	config =>{
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		return config
	},
	error => {
		Toast.failed('请求过程出错')
		console.log(error)
		return Promise.error(error)
	}
)
axios.interceptors.response.use(function(response){
	return response
}, function(error){
	Toast.failed('响应过程出错')
	console.log(error)
	return Promise.reject(error)
})
var request = (options,res) => {
	if(tmpTrip.user) {
		if(options.body) {
			options.body.userId = tmpTrip.user.userId
		}
		if(options.params){
			options.params.userId = tmpTrip.user.userId
		}
	}
	return axios.request({
		url: options.url.indexOf('http') != -1 ? options.url : `http://localhost:3000${options.url}`,
		method: options.method,
		data: stringify(options.body),
		params: options.params
	}).then(response => {
		// console.log(response)
		return response
	}, err => {
		Toast.failed(err.message)
		throw err
	}).catch((error) => {
		Toast.failed('请求失败')
		throw error
	})
}




export const http = {}
const methods = ['get','post','put','delete']
methods.forEach(method => {
	http[method] = (url, params = {}) => {
		if( method === 'get') {
			return request({url,params,method})
		}
		return request({url,body: params,method})
	}
})

export default function plugin (Vue) {
	if(plugin.installed) {
		return
	}
	plugin.installed = true
	Object.defineProperties(Vue.prototype, {
		$http: {
			get () {
				const obj = {
					get: http['get'],
					post: http['post'],
					put: http['put'],
					delete: http['delete']
				}
				return obj
			}
		}
	})
}