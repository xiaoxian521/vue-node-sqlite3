const express = require('express')
const db = require('./db')
const settings = require('./settings')
const jwt = require('jsonwebtoken')

const router = express.Router()

//获取所有tweets信息
router.get("/", function(request, response){
	db.getAllTweets(function(error, tweets){
		if(error){
			response.status(500).end()
		}else{
			response.status(200).json(tweets)
		}
	})
})

//根据ID获取Tweet信息
router.get("/:id", function(request, response){
	const id = request.params.id
	db.getTweetById(id, function(error, tweet){
		if(error){
			response.status(500).end()
		}else if(tweet){
			response.status(200).json(tweet)
		}else{
			response.status(404).end()
		}
	})
})

//根据ID对tweets信息进行
router.delete("/:id", function(request, response){
	const id = request.params.id
	db.deleteTweetById(id, function(error, tweet){
		if(error){
			response.status(500).end()
		}else if(tweet){
			response.status(200).json(tweet)
		}else{
			response.status(404).end()
		}
	})
})

//添加tweets信息
router.post("/", function(request, response){
	let payload = null
	try{
		const authorizationHeader = request.get("Authorization")
		const accessToken = authorizationHeader.substr("Bearer ".length)
		payload = jwt.verify(accessToken, settings.accessTokenSecret)
	}catch(error){
		response.status(401).end()
		return
	}
	const { accountId, message, createdAt, orders, payMethod,} = request.body
	if(payload == null || payload.accountId != accountId){
		response.status(401).end()
		return
	}
	const errors = []
	if(0 < errors.length){
		response.status(400).json(errors)
		return
	}
	db.createTweet(accountId, message, createdAt, orders, payMethod, function(error, id){
		if(error){
			if(error.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"){
				response.status(400).json(["accountDoesNotExist"])
			}else{
				response.status(500).end()
			}
		}else{
			response.setHeader("Location", "/tweets/"+id)
			response.status(201).end()
		}
	})
})

//根据ID修改tweets信息
router.put("/:id", function(request, response){
	const id = request.params.id
	const updatedAccountId = request.body.accountId
	const updatedMessage = request.body.message
	const updateCreatedAt = request.body.createdAt
	const updatedOrders = request.body.orders
	const updatedPayMethod = request.body.payMethod
	db.updateTweetById(id, updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod, function(error){
		if(error){
			if(error.message == "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"){
				response.status(400).json(["accountDoesNotExist"])
			}else{
				response.status(500).end()
			}
		}else{
			response.status(204).end()
		}
	})
})

module.exports = router