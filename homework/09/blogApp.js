// Blog system with post creation functionality
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

// Initialize database
const db = new DB("blog.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);
db.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// Initialize Oak application
const app = new Application();
const router = new Router();

// 簡易 session 管理（用記憶體，實務應用請用 Redis 等）
const sessions = {};
function setSession(ctx, userId) {
  const sid = crypto.randomUUID();
  sessions[sid] = { userId };
  ctx.cookies.set("sid", sid, { httpOnly: true });
}
function getSession(ctx) {
  const sid = ctx.cookies.get("sid");
  if (sid && sessions[sid]) return sessions[sid];
  return null;
}
function clearSession(ctx) {
  const sid = ctx.cookies.get("sid");
  if (sid) delete sessions[sid];
  ctx.cookies.delete("sid");
}

// Serve static files
import { send } from "https://deno.land/x/oak@v11.1.0/mod.ts";

// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Routes
router
  // 註冊頁
  .get("/signup", (ctx) => {
    ctx.response.body = `
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
        input[type="text"], input[type="password"], textarea {
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
    `;
  })
  .post("/signup", async (ctx) => {
    const form = await ctx.request.body({ type: "form" }).value;
    const username = form.get("username");
    const password = form.get("password");
    if (!username || !password) {
      ctx.response.body = "帳號密碼不能為空";
      return;
    }
    try {
      db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
      ctx.response.redirect("/login");
    } catch {
      ctx.response.body = "帳號已存在";
    }
  })
  // 登入頁
  .get("/login", (ctx) => {
    ctx.response.body = `
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
    `;
  })
  .post("/login", async (ctx) => {
    const form = await ctx.request.body({ type: "form" }).value;
    const username = form.get("username");
    const password = form.get("password");
    const user = db.query("SELECT id FROM users WHERE username=? AND password=?", [username, password])[0];
    if (user) {
      setSession(ctx, user[0]);
      ctx.response.redirect("/");
    } else {
      ctx.response.body = "帳號或密碼錯誤";
    }
  })
  // 登出
  .get("/logout", (ctx) => {
    clearSession(ctx);
    ctx.response.redirect("/login");
  })
  // Home page - display posts
  .get("/", async (ctx) => {
    const session = getSession(ctx);
    let user = null;
    if (session) {
      const u = db.query("SELECT id, username FROM users WHERE id=?", [session.userId])[0];
      if (u) user = { id: u[0], username: u[1] };
    }
    const posts = db.query(`SELECT posts.id, posts.title, posts.content, posts.created_at, users.username, posts.user_id FROM posts JOIN users ON posts.user_id=users.id ORDER BY posts.created_at DESC`);
    ctx.response.body = `
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
        ${user ? `登入中：${user.username} <a href="/logout">登出</a>` : `<a href="/login">登入</a> | <a href="/signup">註冊</a>`}
      </div>
      <div class="nav">
        ${user ? '<a href="/new">發布新貼文</a>' : ''}
      </div>
      <h2>所有貼文</h2>
      ${posts.length === 0 ? '<p>目前沒有貼文。</p>' : ''}
      ${Array.from(posts).map(post => `
        <div class="post">
          <h3 class="post-title">${post[1]}</h3>
          <div class="post-meta">發布者：${post[4]} | 發布時間：${formatDate(post[3])}</div>
          <div class="post-content">${post[2]}</div>
          ${user && user.id === post[5] ? `<div class="post-actions"><form action="/delete/${post[0]}" method="post" style="display:inline"><button type="submit" onclick="return confirm('確定刪除?')">刪除</button></form></div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
    `;
  })
  
  // New post form
  .get("/new", (ctx) => {
    const session = getSession(ctx);
    if (!session) {
      ctx.response.redirect("/login");
      return;
    }
    ctx.response.body = `
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
    `;
  })    // Create new post
  .post("/create", async (ctx) => {
    const session = getSession(ctx);
    if (!session) {
      ctx.response.status = 401;
      ctx.response.body = "請先登入";
      return;
    }
    try {
      const formData = await ctx.request.body({ type: "form" }).value;
      const title = formData.get("title");
      const content = formData.get("content");
      if (!title || !content) {
        ctx.response.status = 400;
        ctx.response.body = "標題和內容不能為空";
        return;
      }
      db.query("INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)", [title, content, session.userId]);
      ctx.response.redirect("/");
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = "伺服器內部錯誤：" + error.message;
    }
  })
  // 刪除貼文（僅限本人）
  .post("/delete/:id", (ctx) => {
    const session = getSession(ctx);
    if (!session) {
      ctx.response.status = 401;
      ctx.response.body = "請先登入";
      return;
    }
    const postId = ctx.params.id;
    // 只允許刪除自己的貼文
    const post = db.query("SELECT user_id FROM posts WHERE id=?", [postId])[0];
    if (!post) {
      ctx.response.status = 404;
      ctx.response.body = "貼文不存在";
      return;
    }
    if (post[0] !== session.userId) {
      ctx.response.status = 403;
      ctx.response.body = "只能刪除自己的貼文";
      return;
    }
    db.query("DELETE FROM posts WHERE id=?", [postId]);
    ctx.response.redirect("/");
  });

// Add routes to application
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.addEventListener('error', (evt) => {
  console.log(evt.error);
});

// Start server
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
