const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  },
  {
    username: 'johndoe',
    name: 'John Doe',
    password: 'password123'
  },
  {
    username: 'janedoe',
    name: 'Jane Doe',
    password: 'password456'
  },
  {
    username: 'alice',
    name: 'Alice Example',
    password: 'alicepassword'
  },
  {
    username: 'bob',
    name: 'Bob Example',
    password: 'bobpassword'
  }
]

const populateUsers = async () => {
  await mongoose.connection.asPromise()
  await User.deleteMany({})

  const usersWithHashedPasswords = await Promise.all(
    initialUsers.map(async ({ username, name, password }) => ({
      username,
      name,
      passwordHash: await bcrypt.hash(password, 10)
    }))
  )

  return User.insertMany(usersWithHashedPasswords)
}

const usersInDb = async () => {
  await mongoose.connection.asPromise()
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialUsers,
  populateUsers,
  usersInDb,
}