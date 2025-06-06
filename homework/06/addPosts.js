// Add three posts to the blog
import { DB } from "https://deno.land/x/sqlite/mod.ts";

// Connect to database
const db = new DB("blog.db");

// Create posts table if it doesn't exist
db.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )
`);

// Sample posts data
const posts = [
  {
    title: "我的第一篇文章",
    content: "這是我的第一篇部落格文章。\n\n寫作是一種很好的表達方式，可以分享自己的想法和經驗。希望以後能夠持續更新這個部落格，分享更多有趣的內容。"
  },
  {
    title: "學習程式設計的心得",
    content: "最近我一直在學習程式設計，特別是網頁開發技術。\n\nJavaScript 是一個非常強大的語言，可以用於前端和後端開發。Deno 作為一個新的 JavaScript 執行環境，提供了很多現代化的特性，例如原生支援 TypeScript、安全性優先、標準化模組等等。\n\n學習過程中，我發現最重要的是持續實踐和解決實際問題。"
  },
  {
    title: "關於我",
    content: "嗨，我是Eli Lin，是一名資訊工程學生。\n\n我對程式設計、人工智能和網頁開發非常感興趣。這個部落格是我用來記錄學習過程和分享心得的地方。\n\n除了程式設計，我也喜歡閱讀、遊戲和戶外活動。"
  }
];

// Insert posts into database
console.log("開始新增貼文...");
for (const post of posts) {
  db.query("INSERT INTO posts (title, content) VALUES (?, ?)", [post.title, post.content]);
  console.log(`已新增: ${post.title}`);
}

console.log("成功新增三篇貼文！");

// Close database connection
db.close();
