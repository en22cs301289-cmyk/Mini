const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')
const dbFile = path.join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)

async function init() {
  await db.read()
  db.data ||= { users: [], posts: [], follows: [], comments: [] }
  await db.write()
}

module.exports = { db, init }
