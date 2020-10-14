const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const settings = require('./settings')
const db = require('./db')
const accountRouter = require('./accountRouter')
const tweetRouter = require('./tweetRouter')
const md5 = require('md5-node')

const app = express()

//解决跨域问题
app.use(function (request, response, next) {
	response.setHeader("Access-Control-Allow-Origin", "*")
	response.setHeader("Access-Control-Allow-Methods", "*")
	response.setHeader("Access-Control-Allow-Headers", "*")
	response.setHeader("Access-Control-Expose-Headers", "*")
	next()
})

//对POST请求过来的数据进行解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))

//使得accounts接口可用
app.use("/accounts", accountRouter)
//使得tweets接口可用
app.use("/tweets", tweetRouter)

// 用户登录并设置token令牌
app.post("/tokens", function (request, response) {
	// 将前端传来的用户信息进行解构，直接获取里面的值
	const { grant_type, username, password } = request.body
	db.getAccountByUsername(username, function (error, account) {
		if (error) {
			response.status(500).end()
		} else if (!account || account.password != md5(password)) {
			response.status(400).json({ error: "invalid_client" })
		} else {
			//生成jwt(token令牌)  {expiresIn:3600}为token的过期时间，这里设置的是1小时
			const accessToken = jwt.sign({
				accountId: account.id
			}, settings.accessTokenSecret, { expiresIn: 3600 })
			const idToken = jwt.sign({
				sub: account.id,
				preferred_username: account.username
			}, "some secret that doesn't matter")
			//返回token
			response.status(200).json({
				access_token: accessToken,
				id_token: idToken
			})
		}
	})
})

app.listen(3000, err => {
	if (!err) console.log('Successful Connection! Please Start Your Operation! The Port 3000')
})


// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  头部
// eyJhY2NvdW50SWQiOjEsImlhdCI6MTU3MjU5OTQ3MSwiZXhwIjoxNTcyNTk5NDgxfQ.  载荷
// 01kCpXKp4qQqrofs9LEtssgb6k3V8ZWl_tqsuvRfXeM 签名