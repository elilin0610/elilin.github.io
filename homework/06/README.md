# 部落格系統 - 習題6

這是一個簡單的部落格系統，使用 Deno 和 SQLite 開發，可以新增和顯示貼文。

## 功能

- 顯示所有貼文（按時間排序）
- 新增貼文（包含標題和內容）
- 自動記錄貼文發布時間
- 包含一個可以自動新增三筆貼文的腳本

## 如何運行

### 步驟1: 新增三筆貼文

執行以下命令來新增三篇預設的貼文：

```
deno run --allow-net --allow-read --allow-write addPosts.js
```

### 步驟2: 啟動部落格應用

執行以下命令來啟動部落格應用：

```
deno run --allow-net --allow-read --allow-write blogApp.js
```

### 步驟3: 訪問部落格

在瀏覽器中打開以下網址：
- 首頁：http://localhost:8000
- 新增貼文：http://localhost:8000/new

## 技術說明

這個部落格系統使用了以下技術：

- **Deno**: 一個安全的 JavaScript 和 TypeScript 運行時環境
- **Oak**: 用於 Deno 的中間件框架，類似於 Node.js 的 Express
- **SQLite**: 輕量級的關係型數據庫
- **HTML/CSS**: 用於前端界面

## 資料庫結構

部落格使用了一個名為 `posts` 的表格，結構如下：

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now','localtime'))
)
```

## 說明

該系統滿足了習題6的要求 - 「請寫一個程式可以新增三筆貼文」。
通過運行 `addPosts.js` 腳本，系統會自動新增三篇包含標題和內容的貼文。
此外，系統還提供了一個完整的用戶界面，可以手動新增更多貼文。
