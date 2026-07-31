# CalcHub

A calculator with accounts — sign up, log in (including with Google), calculate, and every result is saved to your own private history. Dark/light mode, scientific mode, unit + currency converters included.

## Folder structure

```
calchub/
├── database/
│   └── schema.sql              # run once in Supabase: tables + security rules
├── email-templates/
│   └── reset-password.html     # paste into Supabase's email template settings
├── public/
│   ├── index.html
│   └── manifest.json           # lets it be installed as an app
├── src/
│   ├── components/
│   │   ├── Calculator.js       # basic + scientific calculator
│   │   ├── History.js          # search, favorite, delete, copy
│   │   ├── UnitConverter.js
│   │   ├── CurrencyConverter.js
│   │   ├── Navbar.js
│   │   ├── Logo.js
│   │   └── GoogleIcon.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── UpdatePassword.js   # reached from the reset-password email link
│   │   ├── Dashboard.js        # stats + calculator + history + tools
│   │   ├── Profile.js
│   │   └── NotFound.js         # 404
│   ├── contexts/
│   │   ├── ThemeContext.js     # dark/light mode
│   │   └── ToastContext.js     # little popup notifications
│   ├── App.js                   # routes + who's allowed to see what
│   ├── index.js
│   ├── styles.css               # the whole design system lives here
│   └── supabaseClient.js
├── .env.example
└── package.json
```

## Setup

1. Create a project at supabase.com
2. SQL Editor → paste `database/schema.sql` → Run
3. Copy `.env.example` to `.env`, fill in your Supabase URL + anon key (Project Settings → API)
4. `npm install`
5. `npm start`

## Turning on Google sign-in

1. Supabase Dashboard → Authentication → Providers → Google → toggle it on
2. Create OAuth credentials at console.cloud.google.com (a Client ID + Secret) and paste them in
3. Add your site's URL to the "Redirect URLs" list in Supabase (Supabase gives you the exact one to copy)

## Custom email template

Authentication → Email Templates → Reset Password → paste in `email-templates/reset-password.html`. It already matches the app's colors.

## Deploy

Push to GitHub, import into Vercel, add the two env variables there too, deploy.

---

## Design system

**Primary color:** `#7C5CFF` (violet)
**Secondary/accent color:** `#22D3EE` (cyan)
**Gradient:** `linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)` — used on the logo, equals button, and primary buttons

**Background (dark mode):** `#0B0D14`
**Background (light mode):** `#F3F4FA`

**Card color (dark mode):** `#151823`
**Card color (light mode):** `#FFFFFF`

**Text (dark mode):** `#F2F3F8` primary / `#8B93A7` muted
**Text (light mode):** `#14161F` primary / `#6B7185` muted

**Success:** `#34D399` · **Error:** `#F87171`

**Fonts:** `Sora` (headings, logo, numbers) + `Inter` (everything else) — both from Google Fonts

**Border radius:** very rounded — 22px on cards, 14px on tabs, 10px on buttons/inputs

**Shadows:** soft — `0 10px 30px rgba(0,0,0,0.35)` in dark mode, a lighter version in light mode

**Buttons:** solid gradient for primary actions, flat frosted-gray for secondary/number buttons, subtle press-down animation on tap

**Logo:** rounded-square gradient mark with a simple calculator glyph, paired with the "CalcHub" wordmark in Sora
