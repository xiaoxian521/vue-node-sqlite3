const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("my-database.db")

db.run("PRAGMA foreign_keys = ON")

//CONSTRAINT unique_username UNIQUE(username)  对username做了唯一约束
// 创建accounts用户表格的命令
// CreationTime为创建时间
db.run(`
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
		password TEXT,
		passwordRepeat TEXT,
		email TEXT,
		creationTime TEXT,
		CONSTRAINT unique_username UNIQUE(username)
	)
`)
// 创建Tweets表格的命令
// id INTEGER主键自动递增
db.run(`
	CREATE TABLE IF NOT EXISTS tweets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		accountId INTEGER,
		message TEXT,
		createdAt INTEGER,
		orders TEXT,
		payMethod TEXT,
		FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE CASCADE
	)
`)

//获取Tweet表格中的所有数据
exports.getAllTweets = function(callback){
	const query = "SELECT * FROM tweets"
	db.all(query, function(error, tweets){
		callback(error, tweets)
	})
}

//通过ID来查看Tweet表格中的数据
exports.getTweetById = function(id, callback){
	const query = "SELECT * FROM tweets WHERE id = ?"
	const values = [id]
	db.get(query, values, function(error, tweet){
		callback(error, tweet)
	})
}

//通过ID来删除Tweet表格中的数据
exports.deleteTweetById = function(id, callback){
	const query = "DELETE FROM tweets WHERE id = ?"
	const values = [id]
	db.run(query, values, function(error){
		callback(error)
	})
}

//创建Tweet表格
exports.createTweet = function(accountId, message, createdAt, orders, payMethod, callback){
	const query = "INSERT INTO tweets (accountId, message, createdAt, orders, payMethod) VALUES (?, ?, ?, ?, ?)"
	const values = [accountId, message, createdAt, orders, payMethod]
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
}

//通过ID来更新Tweet表格中的数据
exports.updateTweetById = function(id, updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod, callback){
	const query = `
	UPDATE tweets SET
		accountId = ?,
		message = ?,
		createdAt = ?,
		orders = ?,
		payMethod = ?
	WHERE
		id = ?
	`
	const values = [updatedAccountId, updatedMessage, updateCreatedAt, updatedOrders, updatedPayMethod, id]
	db.run(query, values, function(error){
		callback(error)
	})

}

//将前端传过来的用户信息插入
exports.createAccount = function(username, password, passwordRepeat, email, creationTime, callback){
	const query = "INSERT INTO accounts (username, password, passwordRepeat, email, creationTime) VALUES (?, ?, ?, ?, ?)"
	const values = [username,password,passwordRepeat,email,creationTime]
	db.run(query, values, function(error){
		callback(error, this.lastID)
	})
}

//通过姓名查找用户信息
exports.getAccountByUsername = function(username, callback){
	const query = "SELECT * FROM accounts WHERE username = ?"
	const values = [username]
	db.get(query, values, function(error, account){
		callback(error, account)
	})
}