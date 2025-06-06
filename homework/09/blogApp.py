# blogApp.py (FastAPI 版本)
from fastapi import FastAPI, Request, Form, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse
from jinja2 import Template
from starlette.middleware.sessions import SessionMiddleware
import sqlite3
import os

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="supersecretkey")

# 初始化資料庫
DB_PATH = "blog.db"
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TEXT DEFAULT (datetime('now','localtime')),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')
    conn.commit()
    conn.close()

init_db()

# Helper: 取得目前登入的 user_id
async def get_current_user(request: Request):
    user_id = request.session.get("user_id")
    if user_id:
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        conn.close()
        return user
    return None

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, user=Depends(get_current_user)):
    conn = get_db()
    posts = conn.execute("SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id=users.id ORDER BY created_at DESC").fetchall()
    conn.close()
    html = """
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>部落格系統</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        .post {
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .post-title {
          margin-top: 0;
          color: #444;
        }
        .post-meta {
          color: #777;
          font-size: 0.9em;
          margin-bottom: 10px;
        }
        .post-content {
          white-space: pre-wrap;
        }
        .nav {
          margin: 20px 0;
        }
        .nav a {
          display: inline-block;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .nav a:hover {
          background-color: #45a049;
        }
        .user-bar {
          float: right;
        }
        .post-actions {
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>我的部落格</h1>
      <div class="user-bar">
        {% if user %}登入中：{{user['username']}} <a href='/logout'>登出</a>{% else %}<a href='/login'>登入</a> | <a href='/signup'>註冊</a>{% endif %}
      </div>
      <div class="nav">
        {% if user %}<a href='/new'>發布新貼文</a>{% endif %}
      </div>
      <h2>所有貼文</h2>
      {% if not posts %}
        <p>目前沒有貼文。</p>
      {% else %}
        {% for post in posts %}
          <div class="post">
            <h3 class="post-title">{{post['title']}}</h3>
            <div class="post-meta">發布者：{{post['username']}} | 發布時間：{{post['created_at']}}</div>
            <div class="post-content">{{post['content']}}</div>
            {% if user and user['id']==post['user_id'] %}
              <div class="post-actions">
                <form action="/delete/{{post['id']}}" method="post" style="display:inline">
                  <button type="submit" onclick="return confirm('確定刪除?')">刪除</button>
                </form>
              </div>
            {% endif %}
          </div>
        {% endfor %}
      {% endif %}
    </body>
    </html>
    """
    return HTMLResponse(Template(html).render(posts=posts, user=user))

@app.get("/signup", response_class=HTMLResponse)
async def signup_form():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>註冊</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        form {
          margin-top: 20px;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        input[type="text"], input[type="password"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          margin-top: 5px;
        }
        button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        .nav {
          margin: 20px 0;
        }
        .nav a {
          display: inline-block;
          padding: 8px 16px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .nav a:hover {
          background-color: #0b7dda;
        }
      </style>
    </head>
    <body>
      <h1>註冊</h1>
      <div class="nav">
        <a href="/">返回首頁</a>
      </div>
      
      <form action="/signup" method="post">
        <div>
          <label for="username">帳號</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">密碼</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">註冊</button>
      </form>
      <p>已有帳號？<a href="/login">登入</a></p>
    </body>
    </html>
    """)

@app.post("/signup")
async def signup(request: Request, username: str = Form(...), password: str = Form(...)):
    conn = get_db()
    try:
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()
        return RedirectResponse("/login", status_code=302)
    except sqlite3.IntegrityError:
        conn.close()
        return HTMLResponse("帳號已存在 <a href='/signup'>返回</a>")

@app.get("/login", response_class=HTMLResponse)
async def login_form():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>登入</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        form {
          margin-top: 20px;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        input[type="text"], input[type="password"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          margin-top: 5px;
        }
        button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        .nav {
          margin: 20px 0;
        }
        .nav a {
          display: inline-block;
          padding: 8px 16px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .nav a:hover {
          background-color: #0b7dda;
        }
      </style>
    </head>
    <body>
      <h1>登入</h1>
      <div class="nav">
        <a href="/">返回首頁</a>
      </div>
      
      <form action="/login" method="post">
        <div>
          <label for="username">帳號</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">密碼</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">登入</button>
      </form>
      <p>沒有帳號？<a href="/signup">註冊</a></p>
    </body>
    </html>
    """)

@app.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password)).fetchone()
    conn.close()
    if user:
        request.session["user_id"] = user["id"]
        return RedirectResponse("/", status_code=302)
    else:
        return HTMLResponse("帳號或密碼錯誤 <a href='/login'>返回</a>")

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/login", status_code=302)

@app.get("/new", response_class=HTMLResponse)
async def new_post_form(request: Request, user=Depends(get_current_user)):
    if not user:
        return RedirectResponse("/login", status_code=302)
    return HTMLResponse("""
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>發布新貼文</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        form {
          margin-top: 20px;
        }
        label {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
        input[type="text"], textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
          margin-top: 5px;
        }
        textarea {
          height: 200px;
          resize: vertical;
        }
        button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        .nav {
          margin: 20px 0;
        }
        .nav a {
          display: inline-block;
          padding: 8px 16px;
          background-color: #2196F3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        .nav a:hover {
          background-color: #0b7dda;
        }
      </style>
    </head>
    <body>
      <h1>發布新貼文</h1>
      <div class="nav">
        <a href="/">返回首頁</a>
      </div>
      
      <form action="/create" method="post">
        <div>
          <label for="title">標題</label>
          <input type="text" id="title" name="title" required>
        </div>
        <div>
          <label for="content">內容</label>
          <textarea id="content" name="content" required></textarea>
        </div>
        <button type="submit">發布貼文</button>
      </form>
    </body>
    </html>
    """)

@app.post("/create")
async def create_post(request: Request, title: str = Form(...), content: str = Form(...), user=Depends(get_current_user)):
    if not user:
        return HTMLResponse("請先登入 <a href='/login'>登入</a>")
    conn = get_db()
    conn.execute("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)", (title, content, user["id"]))
    conn.commit()
    conn.close()
    return RedirectResponse("/", status_code=302)

@app.post("/delete/{post_id}")
async def delete_post(request: Request, post_id: int, user=Depends(get_current_user)):
    if not user:
        return HTMLResponse("請先登入 <a href='/login'>登入</a>")
    conn = get_db()
    post = conn.execute("SELECT * FROM posts WHERE id=?", (post_id,)).fetchone()
    if not post:
        conn.close()
        return HTMLResponse("貼文不存在 <a href='/'>返回</a>")
    if post["user_id"] != user["id"]:
        conn.close()
        return HTMLResponse("只能刪除自己的貼文 <a href='/'>返回</a>")
    conn.execute("DELETE FROM posts WHERE id=?", (post_id,))
    conn.commit()
    conn.close()
    return RedirectResponse("/", status_code=302)
