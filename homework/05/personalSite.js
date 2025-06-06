// Personal Website using Oak framework
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

// Translations for multilingual support
const translations = {
  en: {
    title: "Personal Website",
    welcome: "Welcome to My Personal Website",
    home: "Home",
    name: "Name",
    age: "Age",
    gender: "Gender",
    education: "Education",
    interests: "Interests",
    skills: "Skills",
    allInfo: "All Info",
    homePage: "Home Page",
    welcomeMsg: "Welcome to my personal website! Please use the navigation links above to learn more about me.",
    createdWith: "This website is created using Deno and the Oak framework as part of a homework assignment.",
    namePrefix: "My name is",
    agePrefix: "I am",
    agePostfix: "years old",
    genderPrefix: "I am",
    educationPrefix: "I am a",
    interestsInclude: "My interests include:",
    skillsInclude: "My skills include:",
    personalInfo: "Personal Information",
    backToHome: "Back to Home",
    switchToEnglish: "English",
    switchToChinese: "中文",
    currentLanguage: "Current Language: English"
  },
  zh: {
    title: "個人網站",
    welcome: "歡迎來到我的個人網站",
    home: "首頁",
    name: "姓名",
    age: "年齡",
    gender: "性別",
    education: "教育",
    interests: "興趣",
    skills: "技能",
    allInfo: "所有資訊",
    homePage: "首頁",
    welcomeMsg: "歡迎來到我的個人網站！請使用上方的導航連結了解更多關於我的資訊。",
    createdWith: "此網站使用 Deno 和 Oak 框架創建，作為作業的一部分。",
    namePrefix: "我的姓名是",
    agePrefix: "我今年",
    agePostfix: "歲",
    genderPrefix: "我的性別是",
    educationPrefix: "我是一名",
    interestsInclude: "我的興趣包括：",
    skillsInclude: "我的技能包括：",
    personalInfo: "個人資訊",
    backToHome: "返回首頁",
    switchToEnglish: "English",
    switchToChinese: "中文",
    currentLanguage: "當前語言：中文"
  }
};

// Personal information
const person = {
  name: {
    en: "Eli Lin",
    zh: "林祐陞"
  },
  age: 22,
  gender: {
    en: "Male",
    zh: "男"
  },
  education: {
    en: "Computer Science Student",
    zh: "資訊工程學生"
  },
  interests: {
    en: ["Programming", "Gaming", "Reading"],
    zh: ["程式設計", "遊戲", "閱讀"]
  },
  skills: {
    en: ["JavaScript", "HTML/CSS", "Deno"],
    zh: ["JavaScript", "HTML/CSS", "Deno"]
  },
  github: "https://github.com/elilin0610"
};

// Router setup
router
  .get("/", (ctx) => {
    ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Personal Website</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          background-color: #f5f5f5;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        nav {
          margin: 20px 0;
          padding: 10px;
          background-color: #3498db;
          border-radius: 5px;
        }
        nav a {
          color: white;
          margin-right: 15px;
          text-decoration: none;
          font-weight: bold;
        }
        nav a:hover {
          text-decoration: underline;
        }
        .content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <h1>Welcome to My Personal Website</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/name">Name</a>
        <a href="/age">Age</a>
        <a href="/gender">Gender</a>
        <a href="/education">Education</a>
        <a href="/interests">Interests</a>
        <a href="/skills">Skills</a>
        <a href="/all">All Info</a>
      </nav>
      <div class="content">
        <h2>Home Page</h2>
        <p>Welcome to my personal website! Please use the navigation links above to learn more about me.</p>
        <p>This website is created using Deno and the Oak framework as part of a homework assignment.</p>
      </div>
    </body>
    </html>
    `;
  })
  .get("/name", (ctx) => {
    ctx.response.body = generatePage("My Name", `<p>My name is <strong>${person.name}</strong>.</p>`);
  })
  .get("/age", (ctx) => {
    ctx.response.body = generatePage("My Age", `<p>I am <strong>${person.age}</strong> years old.</p>`);
  })
  .get("/gender", (ctx) => {
    ctx.response.body = generatePage("My Gender", `<p>I am <strong>${person.gender}</strong>.</p>`);
  })
  .get("/education", (ctx) => {
    ctx.response.body = generatePage("My Education", `<p>I am a <strong>${person.education}</strong>.</p>`);
  })
  .get("/interests", (ctx) => {
    const interestsList = person.interests.map(interest => `<li>${interest}</li>`).join("");
    ctx.response.body = generatePage("My Interests", `
      <p>My interests include:</p>
      <ul>${interestsList}</ul>
    `);
  })
  .get("/skills", (ctx) => {
    const skillsList = person.skills.map(skill => `<li>${skill}</li>`).join("");
    ctx.response.body = generatePage("My Skills", `
      <p>My skills include:</p>
      <ul>${skillsList}</ul>
    `);
  })
  .get("/all", (ctx) => {
    const interestsList = person.interests.map(interest => `<li>${interest}</li>`).join("");
    const skillsList = person.skills.map(skill => `<li>${skill}</li>`).join("");
    
    ctx.response.body = generatePage("All About Me", `
      <h3>Personal Information</h3>
      <ul>
        <li><strong>Name:</strong> ${person.name}</li>
        <li><strong>Age:</strong> ${person.age}</li>
        <li><strong>Gender:</strong> ${person.gender}</li>
        <li><strong>Education:</strong> ${person.education}</li>
      </ul>
      
      <h3>Interests</h3>
      <ul>${interestsList}</ul>
      
      <h3>Skills</h3>
      <ul>${skillsList}</ul>
      
      <p>GitHub: <a href="${person.github}" target="_blank">${person.github}</a></p>
    `);
  });

// Helper function to generate HTML page with common layout
function generatePage(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Personal Website</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        background-color: #f5f5f5;
        color: #333;
      }
      h1 {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
      }
      nav {
        margin: 20px 0;
        padding: 10px;
        background-color: #3498db;
        border-radius: 5px;
      }
      nav a {
        color: white;
        margin-right: 15px;
        text-decoration: none;
        font-weight: bold;
      }
      nav a:hover {
        text-decoration: underline;
      }
      .content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .back-link {
        margin-top: 20px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/name">Name</a>
      <a href="/age">Age</a>
      <a href="/gender">Gender</a>
      <a href="/education">Education</a>
      <a href="/interests">Interests</a>
      <a href="/skills">Skills</a>
      <a href="/all">All Info</a>
    </nav>
    <div class="content">
      ${content}
      <p class="back-link"><a href="/">Back to Home</a></p>
    </div>
  </body>
  </html>
  `;
}

// Setup middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
