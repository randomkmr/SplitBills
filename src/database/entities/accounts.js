const mysql = require('mysql2/promise')
const { mysqlConfig } = require('../../config')

// Post an Account
exports.postAccDb = async (group_id, user_id) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
      INSERT INTO accounts(group_id, user_id)
      VALUES(?, ?)
      `,
    [group_id, user_id],
  )
  await con.end()
  return result
}

// Get an account
exports.getAccDb = async (id) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
        SELECT user_id, group_id, name FROM accounts
        LEFT JOIN "groups"
        ON accounts.group_id = "groups".id
        WHERE user_id = ?
        `,
    [id],
  )
  await con.end()
  return result
}
