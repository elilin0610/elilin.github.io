# Personal Website with Oak Framework

This is a simple personal website created using Deno and Oak framework as required by Homework 5.

## Requirements

- Deno installed on your system
- Internet connection to fetch Oak framework from deno.land

## How to Run

1. Open a terminal in this directory
2. Run the following command:

```
deno run --allow-net personalSite.js
```

3. Open your browser and navigate to `http://localhost:8000`

## Features

This website responds to different paths as required by the assignment:

- `/name` - Shows my name
- `/age` - Shows my age
- `/gender` - Shows my gender

Additional features:

- `/` - Home page
- `/education` - Shows my education
- `/interests` - Shows my interests
- `/skills` - Shows my skills
- `/all` - Shows all information in one page

### Multilingual Support

The website supports both English and Chinese languages:

- Add `?lang=en` to any URL for English version
- Add `?lang=zh` for Chinese version
- Language can be switched using the language selector at the top right of each page

## Structure

- `personalSite.js` - The main application file
- A template function is used to generate consistent HTML pages
- Navigation links are included on all pages
- Translation system using a dictionary for each supported language

## Technology

- Deno
- Oak web framework
- HTML/CSS for presentation
