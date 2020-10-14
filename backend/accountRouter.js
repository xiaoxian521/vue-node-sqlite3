const express = require('express')
const db = require('./db')
const md5 = require('md5-node')

const router = express.Router()

//添加用户信息
router.post("/", function(request, response){
	// 接收前端传过来的用户信息（解构赋值）
	const { username, password, passwordRepeat, email } = request.body
	//在后台定义用户注册时间才是符合规范的
	const creationTime = new Date().toLocaleString()
	if(
		typeof username != "string"       ||
		typeof password != "string"       ||
		typeof passwordRepeat != "string" ||
		typeof email != "string"          ||
		typeof creationTime != "string"
	){
		response.status(422).end()
		return
	}
	//这里对用户所有密码都进行了加密
	db.createAccount(username, md5(password), md5(passwordRepeat), email, creationTime, function(error, id){
		if(error){
			if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.username"){
				response.status(400).json(["usernameTaken"])
			}else{
				response.status(500).end()
			}
		}else{
			response.setHeader("Location", "/accounts/"+id)
			response.status(201).end()
		}
	})

})

module.exports = router