const mysql = require('mysql2/promise')
const { mysqlConfig, secretKey } = require('../../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register User
exports.registerUser = async (full_name, email, password) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
      INSERT INTO users(full_name, email, password)
      VALUES(?, ?, ?)
      `,
    [full_name, email, hashedPassword],
  )
  await con.end()
  return result
}

// Login User
exports.loginUser = async (email, password) => {
  console.log('Trying to Login..')
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
        SELECT *
        FROM users
        WHERE email = ?
        `,
    [email],
  )
  await con.end()
  console.log(result)
  const isLoggedIn = bcrypt.compareSync(password, result[0].password)
  console.log('Login: ', isLoggedIn)

  if (!isLoggedIn) {
    return 'Login error'
  }

  const token = jwt.sign(
    {
      id: result[0].id,
      email: result[0].email,
    },
    secretKey,
  )
  console.log(token)
  return token
}
