// Blog system with post creation functionality
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Initialize database
const db = new DB("blog.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )
`);

// Initialize Oak application
const app = new Application();
const router = new Router();

// Serve static files
import { send } from "https://deno.land/x/oak/mod.ts";

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
  // Home page - display posts
  .get("/", async (ctx) => {
    // Get all posts
    const posts = db.query("SELECT * FROM posts ORDER BY created_at DESC");
    
    // Render home page with posts
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
      </style>
    </head>
    <body>
      <h1>我的部落格</h1>
      <div class="nav">
        <a href="/new">發布新貼文</a>
      </div>
      
      <h2>所有貼文</h2>
      ${posts.length === 0 ? '<p>目前沒有貼文。</p>' : ''}
      ${Array.from(posts).map(post => `
        <div class="post">
          <h3 class="post-title">${post[1]}</h3>
          <div class="post-meta">發布時間：${formatDate(post[3])}</div>
          <div class="post-content">${post[2]}</div>
        </div>
      `).join('')}
    </body>
    </html>
    `;
  })
  
  // New post form
  .get("/new", (ctx) => {
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
  })
  
  // Create new post
  .post("/create", async (ctx) => {
    const body = ctx.request.body();
    
    if (body.type === "form") {
      const formData = await body.value;
      const title = formData.get("title");
      const content = formData.get("content");
      
      // Insert new post into database
      db.query("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content]);
      
      // Redirect to home page
      ctx.response.redirect("/");
    }
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
