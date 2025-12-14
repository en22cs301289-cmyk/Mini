const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { db, init } = require('./db')

const SECRET = process.env.JWT_SECRET || 'change_this_secret'
const app = express()
// disable ETag to avoid 304 cache responses during development
app.disable('etag')
// allow CORS and authorization header
app.use(cors({ origin: true, credentials: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type')
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type')
  next()
})
app.use(express.json())

// uploads
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
app.use('/uploads', express.static(uploadDir))
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({ storage })

// auth middleware
async function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Missing auth' })
  const token = header.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, SECRET)
    await db.read()
    const user = db.data.users.find(u => u.id === payload.id)
    if (!user) return res.status(401).json({ error: 'Invalid user' })
    req.user = user
    next()
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('auth verify error:', err && err.message)
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// init DB
init()

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })
  await db.read()
  if (db.data.users.find(u => u.username === username)) return res.status(400).json({ error: 'username exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = { id: nanoid(), username, password: hash, createdAt: Date.now() }
  db.data.users.push(user)
  await db.write()
  const token = jwt.sign({ id: user.id }, SECRET)
  res.json({ token, user: { id: user.id, username: user.username } })
})

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })
  await db.read()
  const user = db.data.users.find(u => u.username === username)
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user.id }, SECRET)
  res.json({ token, user: { id: user.id, username: user.username } })
})

// Follow
app.post('/api/follow/:id', auth, async (req, res) => {
  const targetId = req.params.id
  await db.read()
  const exists = db.data.follows.find(f => f.follower === req.user.id && f.following === targetId)
  if (exists) return res.status(400).json({ error: 'already following' })
  db.data.follows.push({ id: nanoid(), follower: req.user.id, following: targetId })
  await db.write()
  res.json({ ok: true })
})
app.post('/api/unfollow/:id', auth, async (req, res) => {
  const targetId = req.params.id
  await db.read()
  db.data.follows = db.data.follows.filter(f => !(f.follower === req.user.id && f.following === targetId))
  await db.write()
  res.json({ ok: true })
})

// Create post (image URL provided or upload)
app.post('/api/posts', auth, upload.single('image'), async (req, res) => {
  const { caption, imageUrl } = req.body
  let image = imageUrl || null
  if (req.file) image = `/uploads/${req.file.filename}`
  if (!image) return res.status(400).json({ error: 'image required' })
  await db.read()
  const post = { id: nanoid(), author: req.user.id, image, caption: caption || '', likes: [], createdAt: Date.now() }
  db.data.posts.unshift(post)
  await db.write()
  res.json(post)
})

// Like / Unlike
app.post('/api/posts/:id/like', auth, async (req, res) => {
  const id = req.params.id
  await db.read()
  const post = db.data.posts.find(p => p.id === id)
  if (!post) return res.status(404).json({ error: 'post not found' })
  if (!post.likes.includes(req.user.id)) post.likes.push(req.user.id)
  await db.write()
  res.json({ ok: true })
})
app.post('/api/posts/:id/unlike', auth, async (req, res) => {
  const id = req.params.id
  await db.read()
  const post = db.data.posts.find(p => p.id === id)
  if (!post) return res.status(404).json({ error: 'post not found' })
  post.likes = post.likes.filter(u => u !== req.user.id)
  await db.write()
  res.json({ ok: true })
})

// Comment
app.post('/api/posts/:id/comment', auth, async (req, res) => {
  const id = req.params.id
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'text required' })
  await db.read()
  const post = db.data.posts.find(p => p.id === id)
  if (!post) return res.status(404).json({ error: 'post not found' })
  const comment = { id: nanoid(), postId: id, author: req.user.id, text, createdAt: Date.now() }
  db.data.comments.push(comment)
  await db.write()
  res.json(comment)
})

// Feed - posts by followed users and own posts
app.get('/api/feed', auth, async (req, res) => {
  await db.read()
  const following = db.data.follows.filter(f => f.follower === req.user.id).map(f => f.following)
  const feedUserIds = [req.user.id, ...following]
  const posts = db.data.posts
    .filter(p => feedUserIds.includes(p.author))
    .map(p => {
      const author = db.data.users.find(u => u.id === p.author) || { id: p.author, username: 'unknown' }
      return {
        ...p,
        authorProfile: { id: author.id, username: author.username },
        comments: db.data.comments
          .filter(c => c.postId === p.id)
          .map(c => {
            const ca = db.data.users.find(u => u.id === c.author) || { id: c.author, username: 'unknown' }
            return { ...c, authorProfile: { id: ca.id, username: ca.username } }
          })
      }
    })
  res.json(posts)
})

// List users
app.get('/api/users', async (req, res) => {
  await db.read()
  res.json(db.data.users.map(u => ({ id: u.id, username: u.username })))
})

// upload-only endpoint
app.post('/api/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Server listening on', PORT))
