# 🚀 Supabase Setup Guide for ZeroStack

This guide will help you connect ZeroStack to Supabase for cloud-based data storage and authentication.

## 📋 Prerequisites

- A Supabase account (free tier works great!)
- Your ZeroStack project running locally

## 1️⃣ Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `zerostack` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for your database to be provisioned

## 2️⃣ Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see two important keys:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## 3️⃣ Configure Environment Variables

1. In your ZeroStack project root, create a file named `.env.local`
2. Copy the template from `.env.local.example`:

```bash
# Copy the example file
cp .env.local.example .env.local
```

3. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## 4️⃣ Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

This will create:
- ✅ `folders` table - for organizing datasets
- ✅ `tables` table - for storing your datasets
- ✅ `views` table - for grid/gallery/form views
- ✅ Row Level Security (RLS) policies - so users only see their own data
- ✅ Indexes for fast queries
- ✅ Triggers for automatic timestamp updates

## 5️⃣ Enable Authentication Providers (Optional)

### Google OAuth (Recommended)

1. Go to **Authentication** → **Providers** in Supabase
2. Find **Google** and click to configure
3. Follow the instructions to:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth credentials
   - Add authorized redirect URIs
4. Paste your Google Client ID and Secret into Supabase
5. Click **Save**

### Email/Password (Built-in)

Email authentication is enabled by default! Users can sign up with email/password.

## 6️⃣ Test the Connection

1. Restart your Next.js dev server:
```bash
npm run dev
```

2. Open `http://localhost:3000`
3. Click **"Get Started"** to go to the dashboard
4. You should see a sign-in page (if Supabase is configured)
5. Sign up with email or Google
6. Start creating folders and datasets!

## 7️⃣ Verify Everything Works

### Check Database
1. Go to Supabase → **Table Editor**
2. You should see `folders`, `tables`, and `views` tables
3. Create a folder in ZeroStack
4. Refresh the Table Editor - you should see your folder!

### Check Authentication
1. Go to Supabase → **Authentication** → **Users**
2. You should see your user account listed

### Check Real-time (Optional)
1. Open ZeroStack in two browser windows
2. Create a folder in one window
3. It should appear in the other window automatically! 🎉

## 🔧 Troubleshooting

### "Supabase not configured" warning
- Check that `.env.local` exists and has the correct keys
- Restart your dev server after creating `.env.local`
- Make sure the keys don't have quotes around them

### "Failed to fetch" errors
- Check your Supabase project is running (not paused)
- Verify the URL and anon key are correct
- Check browser console for detailed error messages

### RLS Policy errors
- Make sure you're signed in
- Check that the SQL schema was run successfully
- Verify policies exist in Supabase → **Authentication** → **Policies**

### Data not syncing
- Check browser console for errors
- Verify you're signed in with the same account
- Try refreshing the page

## 📊 Database Schema Overview

```
┌─────────────┐
│   folders   │
├─────────────┤
│ id          │
│ user_id     │──┐
│ name        │  │
│ color       │  │
│ created_at  │  │
│ updated_at  │  │
└─────────────┘  │
                 │
┌─────────────┐  │
│   tables    │  │
├─────────────┤  │
│ id          │  │
│ user_id     │──┤
│ folder_id   │──┘
│ name        │
│ columns     │ (JSONB)
│ rows        │ (JSONB)
│ created_at  │
│ updated_at  │
└─────────────┘
       │
       │
┌─────────────┐
│    views    │
├─────────────┤
│ id          │
│ user_id     │──┐
│ table_id    │──┘
│ name        │
│ type        │
│ filters     │ (JSONB)
│ sorts       │ (JSONB)
│ color_rules │ (JSONB)
│ visible_cols│ (JSONB)
│ created_at  │
│ updated_at  │
└─────────────┘
```

## 🎯 Next Steps

Once Supabase is configured:

1. **Deploy to Production**: Your app will automatically use Supabase in production too!
2. **Add More Auth Providers**: GitHub, Discord, Twitter, etc.
3. **Enable Real-time**: Already built-in! Data syncs across devices automatically
4. **Add File Storage**: Use Supabase Storage for file uploads
5. **Set up Backups**: Configure automatic database backups in Supabase

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the browser console for error messages
- Review `lib/supabase-service.ts` for implementation details

---

**Note**: ZeroStack works in **fallback mode** without Supabase (using localStorage), but you won't have:
- ❌ Multi-device sync
- ❌ User authentication
- ❌ Cloud backup
- ❌ Real-time collaboration

Configure Supabase to unlock these features! 🚀
