const mysql = require('mysql2/promise')
const { mysqlConfig } = require('../../config')

// Post a Bill
exports.postBillDb = async (group_id, amount, description) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
      INSERT INTO bills(group_id, amount, description)
      VALUES(?, ?, ?)      
      `,
    [group_id, amount, description],
  )
  await con.end()
  return result
}

// Get all Bills from a group
exports.getBillsDb = async (id) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
    SELECT * FROM bills
    WHERE group_id=${id}
    `,
  )
  await con.end()
  return result
}

//Get total amount of money for the group
exports.getTotalAmount = async (id) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
    SELECT SUM(amount)
    FROM bills
    WHERE group_id=${id}
    `,
  )
  await con.end()
  const returnResult = Object.values(result[0])[0]
    ? Object.values(result[0])[0]
    : '0'
  return returnResult
}

exports.getNumberOfUsers = async (id) => {
  const con = await mysql.createConnection(mysqlConfig)
  const [result] = await con.execute(
    `
    SELECT COUNT(user_id)
    FROM accounts
    WHERE group_id=${id}
    `,
  )
  await con.end()
  return Object.values(result[0])[0]
}
