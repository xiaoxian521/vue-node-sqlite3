const jwtDecode = require('jwt-decode')
let accessToken = null

//获取所有tweets信息接口
export const getAllTweets = function (callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets")
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				global.console.log(tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ID搜索tweets信息接口
export const getSearchTweets = function (searchId, callback) {
	const request = new XMLHttpRequest()
	request.open("GET", "http://localhost:3000/tweets/" + searchId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				const bodyAsString = request.responseText
				const tweets = JSON.parse(bodyAsString)
				callback([], tweets)
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//根据ID对tweets信息进行删除
export const getDelTweets = function (infoId, callback) {
	const request = new XMLHttpRequest()
	request.open("DELETE", "http://localhost:3000/tweets/" + infoId)
	request.send()
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				callback(["Delete success"])
				break
			case 500:
				callback(["Server error"])
				break
			default:
				callback(["Server error"])
		}
	})
}

//修改tweets信息接口
export const modifyTweet = function (id, accountId, message, createdAt, orders, payMethod, callback) {
	const tweet = {
		id,
		accountId,
		message,
		createdAt,
		orders,
		payMethod
	}
	const request = new XMLHttpRequest()
	request.open("PUT", "http://localhost:3000/tweets/" + id)
	request.send(JSON.stringify(tweet))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//添加tweets信息接口
export const createTweet = function (accountId, message, orders, payMethod, callback) {
	const tweet = {
		accountId,
		message,
		orders,
		payMethod,
		createdAt: Date.now()
	}
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/tweets")
	request.setRequestHeader("Content-Type", "application/json")
	request.setRequestHeader("Authorization", "Bearer " + accessToken)
	request.send(JSON.stringify(tweet))
	global.console.log(JSON.stringify(tweet))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 401:
				callback(["unauthorired"])
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//用户注册接口
export const createAccount = function (username, password, passwordRepeat, email, callback) {
	const account = {
		username,
		password,
		passwordRepeat,
		email
	}
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/accounts")
	request.setRequestHeader("Content-Type", "application/json")
	request.send(JSON.stringify(account))
	global.console.log(account)
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 201:
				const location = request.getResponseHeader("Location")
				callback([], location)
				break
			case 400:
				const errors = JSON.parse(request.responseText)
				callback(errors)
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}

//用户登录接口
export const login = function (username, password, callback) {
	const request = new XMLHttpRequest()
	request.open("POST", "http://localhost:3000/tokens")
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	request.send("grant_type=password&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))
	request.addEventListener("load", () => {
		const status = request.status
		switch (status) {
			case 200:
				var body = JSON.parse(request.responseText)
				const idToken = body.id_token
				accessToken = body.access_token
				const userInfo = jwtDecode(idToken)
				const id = userInfo.sub
				const username = userInfo.preferred_username
				callback([], id, username)
				break
			case 400:
				var body = JSON.parse(request.responseText)
				callback([body.error])
				break
			case 500:
				callback(["Unknown server error"])
				break
			default:
				callback(["Unknown server error"])
		}
	})
}