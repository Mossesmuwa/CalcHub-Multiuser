# CalcHub

A calculator that remembers. Every user gets their own account, their own calculation history, their own notes — all kept private from everyone else, enforced by the database itself rather than just the app's code.

This document explains what CalcHub is, how it works, and how to run it — written for anyone opening this project for the first time, not just its author.

Live app: add your Vercel URL here
Repo: Mossesmuwa/CalcHub-Multiuser

---

## What CalcHub is

CalcHub is a full-stack calculator web app. Anyone can create an account, do math, and every result they calculate is saved automatically under their own user ID. Users can search, favorite, or delete past calculations, keep a personal notepad, convert units or currencies, and manage their own account settings — all behind a login.

The interesting part isn't the math. It's everything around it: authentication, data isolation between users, input validation, and a design that feels like a real product rather than a tutorial project.

---

## Features

**Accounts**
- Email/password signup and login, plus "Continue with Google"
- Email verification on signup
- Forgot-password flow with a real reset email, styled to match the app
- Password strength meter (single growing bar, not segmented boxes) enforced on signup and reset — 8+ characters, uppercase, lowercase, number
- Live "passwords match" indicator while typing a confirmation, on both signup and password reset
- Show/hide password toggle
- Client-side email format checking before anything hits the server
- Login shows a single generic message ("email or password is incorrect") rather than saying which one is wrong — this is a deliberate security choice, explained in the Security section below, not an oversight

**Profile & Settings**
- Display name, profile picture upload (drag a photo onto the avatar circle)
- Upload validation: only PNG/JPG/WEBP, under 2MB — checked in the browser and enforced again at the database level
- Remove profile picture
- Clear calculation history, remove all favorites, delete all notes — each with its own confirmation
- Delete account (wipes your data and signs you out; see the security section for the one limitation here)

**Calculator**
- Basic and Scientific modes (sin, cos, tan, log, ln, square root, powers, pi)
- Memory functions (MC, MR, M+, M-)
- Keyboard input support
- Parentheses and percentage
- Specific error messages instead of a generic "Error": "Can't divide by zero," "Check your parentheses," "That doesn't compute"
- No free-text input field — every character comes from a button the app controls (see security)

**History**
- Every calculation saved automatically with a timestamp
- Search with a one-tap clear button, star/unstar, delete with a 5-second undo, or clear everything at once
- Copy any result to your clipboard

**Favorites**
- Its own tab on the dashboard, not just a filter buried in history

**Notes**
- A private notepad tied to your account — write, edit inline (saves automatically when you click away, only if something actually changed), delete with undo

**Tools**
- Unit converter (length, weight)
- Live currency converter


---

## How it works

1. A visitor lands on the site and is sent to `/login` if they're not signed in.
2. They sign up or log in. Supabase Auth issues a session token; the app stores nothing about passwords itself.
3. Once logged in, they see the dashboard: the calculator on one side, history/favorites/notes/tools on the other.
4. Every time they press "=", the result is written to the `calculations` table along with their user ID.
5. When they open History, the app asks the database for calculations belonging to their user ID — and even if it asked for everyone's, the database would only hand back their own rows. That's Row Level Security, not app logic.
6. Logging out clears the session; visiting any page while logged out redirects back to `/login`. Visiting a URL that doesn't exist shows a proper 404, not a blank screen.

---

## Security

Data protection isn't an afterthought here — it's built into the database itself, not just the app's code. Here's what's in place and why:

**Row Level Security (RLS)**
Every table (`calculations`, `notes`, `profiles`) has RLS turned on in Postgres. Each policy checks `auth.uid() = user_id` before allowing a read, write, update, or delete.

**No account enumeration**

**File upload validation**
Profile picture uploads are checked twice: once in the browser (file type and a 2MB size limit, with an instant clear error) 

**Storage isolation**

**No free-text calculator injection**
The calculator has no text input field — every character in an expression comes from a button press the app controls.

**Password requirements**
Signup and password reset both require 8+ characters with an uppercase letter, a lowercase letter, and a number, shown live 

**Crash containment**
A React error boundary wraps the whole app

**Transport and headers**
HTTPS is enforced automatically by Vercel.

**Account deletion done properly**

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React (Create React App), React Router |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database | Supabase Postgres, Row Level Security |
| File storage | Supabase Storage |
| Hosting | Vercel |
| Currency data | open.er-api.com (free, no key) |

---

## Folder structure

```
calchub/
├── database/
│   ├── schema.sql               # core tables + RLS policies
│   ├── schema-updates.sql       # avatar column, storage bucket, notes table
│   └── schema-updates-2.sql     # upload size/type limit at the database level
├── email-templates/
│   └── reset-password.html      # paste into Supabase's email template settings
├── public/
│   ├── index.html
│   ├── favicon.svg               # the hub-node icon
│   └── manifest.json
├── src/
│   ├── components/                # Calculator, History, Notes, Navbar, Logo, Icons, Skeleton, converters
│   ├── pages/                     # Login, Register, UpdatePassword, Dashboard, Profile, NotFound
│   ├── contexts/                  # ThemeContext (dark/light), ToastContext (notifications + undo)
│   ├── utils/                     # mathEngine.js (+ test), passwordStrength.js, errors.js, validate.js
│   ├── App.js                      # routes + who's allowed to see what
│   ├── styles.css                  # the entire design system
│   └── supabaseClient.js
├── supabase/
│   └── functions/
│       └── delete-account/         # runs server-side, holds the admin key the app never sees
├── vercel.json                     # security headers
└── .env.example
```

---

## Design system

| | |
|---|---|
| Primary gradient | `#FFB648` to `#FF6B4A` (gold to orange) |
| Accent | `#2DD4BF` (teal) |
| Background, dark | `#090B10` |
| Background, light | `#F4EFEA` |
| Card surface | translucent glass with `backdrop-filter: blur()`, not a flat fill |
| Text, dark mode | `#F2F3F8` primary / `#8B93A7` muted |
| Text, light mode | `#14161F` primary / `#6B7185` muted |
| Success / Error | `#34D399` / `#F87171` |
| Fonts | Sora (headings, logo, numbers), Inter (everything else) |
| Corners | very rounded — 24px cards, 16px tabs, 12px buttons/inputs |
| Shadows | soft, large blur, low opacity |
| Icon/logo | a center "hub" node linked to four points with a small equals mark, on a gradient badge — represents both halves of "CalcHub" instead of a generic calculator grid |

---

