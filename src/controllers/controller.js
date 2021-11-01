const usersEntity = require('../database/entities/users')
const billsEntity = require('../database/entities/bills')
const accountsEntity = require('../database/entities/accounts')

// Auth register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body
    const data = await usersEntity.registerUser(full_name, email, password)
    res.render('login-user', {
      alert: 'User registered successfully! Please Log in!',
    })
  } catch (error) {
    console.log(error)
    res.render('register-user', {
      alert: 'Something wrong..!',
    })
  }
}

exports.registerGet = async (req, res) => {
  try {
    res.render('register-user')
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

// Auth login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await usersEntity.loginUser(email, password)
    res.cookie('authtoken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 90000,
    })
    res.redirect('/accounts')
  } catch (error) {
    console.log(error)
    res.render('login-user', {
      alert: 'Something wrong..!',
    })
  }
}

exports.loginGet = async (req, res) => {
  res.render('login-user')
}

// Post Bill
exports.postBill = async (req, res) => {
  try {
    const { group_id, amount, description } = req.body
    const data = await billsEntity.postBillDb(group_id, amount, description)
    res.redirect(`/bills/${group_id}`)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

// Get Bills
exports.getBills = async (req, res) => {
  try {
    const data = await billsEntity.getBillsDb(req.params.id)
    const group_id = req.params.id
    const totalAmount = await billsEntity.getTotalAmount(req.params.id)
    const totalUsers = await billsEntity.getNumberOfUsers(req.params.id)
    const theSplit = (totalAmount / totalUsers).toFixed(2)
    res.render('view-bills', {
      data,
      group_id,
      totalAmount,
      totalUsers,
      theSplit,
    })
    data.forEach((item, i) => {
      item.id = i + 1
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

// Post Accounts
exports.postAccounts = async (req, res) => {
  try {
    const group_id = Object.values(req.body)[0]
    const user_id = Object.values(req.user)[0]
    const data = await accountsEntity.getAccDb(Object.values(req.user)[0])
    const arr = []
    const user_groups = data.map((u, i) => (arr[i] = u.group_id))
    if (!user_groups.includes(Number(group_id))) {
      const data2 = await accountsEntity.postAccDb(group_id, user_id)
      res.redirect('/accounts')
    } else {
      res.status(500).json({"message":"This group is already assigned to your user!" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ "message":"Error, ID does not exist i DB!"})
  }
}

// Get Accounts
exports.getAccounts = async (req, res) => {
  try {
    const userEmail = Object.values(req.user)[1]
    const data = await accountsEntity.getAccDb(Object.values(req.user)[0])
    res.render('view-accounts', {
      data,
      userEmail,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}
