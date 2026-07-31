# Calculator App

A simple multi-user calculator. Sign up, log in, do math, see your own history — nobody else's.

## Folder structure

```
calculator-app/
├── database/
│   └── schema.sql          # run this in Supabase once, sets up the table + security rules
├── public/
│   └── index.html          # the page shell
├── src/
│   ├── components/
│   │   ├── Auth.js         # sign up / log in form
│   │   ├── Calculator.js   # the calculator itself, saves each result
│   │   └── History.js      # shows the logged-in user's past calculations
│   ├── App.js               # decides: show login screen or the app
│   ├── App.css              # all the styling
│   ├── index.js              # React entry point
│   └── supabaseClient.js    # connects to Supabase
├── .env.example              # copy to .env and fill in your own keys
├── .gitignore
└── package.json
```

## Setup

1. Create a project at supabase.com
2. Go to SQL Editor, paste in `database/schema.sql`, run it
3. Copy `.env.example` to `.env`, fill in your Supabase URL and anon key (Project Settings → API)
4. `npm install`
5. `npm start`

## Deploy

Push to GitHub, import the repo into Vercel, add the same two env variables there, deploy.
