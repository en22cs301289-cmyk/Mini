const API = process.env.REACT_APP_API || 'http://127.0.0.1:4000/api'

function authHeader() {
  const token = localStorage.getItem('token')
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('authHeader debug: token present=', !!token, 'length=', token ? token.length : 0, 'startsWith eyJ=', token ? token.startsWith('eyJ') : false)
    } catch (e) {
      console.log('authHeader debug: token read error', e)
    }
  }
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function signup(body) {
  return fetch(`${API}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json())
}

export async function login(body) {
  return fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json())
}

export async function getUsers() {
  return fetch(`${API}/users`).then(r => r.json())
}

export async function getFeed() {
  return fetch(`${API}/feed`, { headers: { ...authHeader() } }).then(r => r.json())
}

export async function createPostJson(body) {
  return fetch(`${API}/posts`, { method: 'POST', headers: { ...authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json())
}

export async function follow(userId) {
  return fetch(`${API}/follow/${userId}`, { method: 'POST', headers: { ...authHeader() } }).then(r => r.json())
}

export async function unfollow(userId) {
  return fetch(`${API}/unfollow/${userId}`, { method: 'POST', headers: { ...authHeader() } }).then(r => r.json())
}

export async function likePost(postId) {
  return fetch(`${API}/posts/${postId}/like`, { method: 'POST', headers: { ...authHeader() } }).then(r => r.json())
}

export async function unlikePost(postId) {
  return fetch(`${API}/posts/${postId}/unlike`, { method: 'POST', headers: { ...authHeader() } }).then(r => r.json())
}

export async function commentPost(postId, text) {
  return fetch(`${API}/posts/${postId}/comment`, { method: 'POST', headers: { ...authHeader(), 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }).then(r => r.json())
}

export async function uploadFile(formData) {
  return fetch(`${API}/upload`, { method: 'POST', headers: { ...authHeader() }, body: formData }).then(r => r.json())
}

export default { signup, login, getUsers, getFeed, createPostJson, follow, unfollow, likePost, unlikePost, commentPost, uploadFile }
