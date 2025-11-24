# 🚀 Quick Start: Supabase Setup

Get your ZeroStack app connected to Supabase in 5 minutes!

## ⚡ Quick Steps

### 1️⃣ Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: ZeroStack
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### 2️⃣ Run Database Schema (1 min)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy contents from `supabase/schema.sql`
4. Paste and click **"Run"**
5. ✅ You should see "Success. No rows returned"

### 3️⃣ Get API Keys (30 sec)

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...` - keep secret!)

### 4️⃣ Update Environment Variables (30 sec)

Create/update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 5️⃣ Create User Account (1 min)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: your@email.com
   - **Password**: (choose a password)
4. Click **"Create user"**
5. **Copy the User UID** (you'll need this for seeding)

### 6️⃣ Seed Sample Data (1 min)

Update `.env.local` with your User UID:

```bash
SEED_USER_ID=your-user-uid-here
```

Install dependencies and run seed:

```bash
npm install
npm run seed
```

### 7️⃣ Start Your App! (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ What You Get

After seeding, your app will have:

### 📁 **3 Folders**
- Amazon Returns (Green)
- Clients (Blue)  
- Projects (Purple)

### 📊 **9 Datasets**
- Returns Report
- Orders Report
- Inventory Report
- Client Contact List
- Project Timeline
- Website Redesign
- Marketing Campaign
- Product Launch
- Client Onboarding

### 📋 **18 Views**
- 2 views per dataset (Grid + Kanban)

### 📈 **27 Rows**
- Real sample data ready to explore!

---

## 🎯 Next Steps

1. **Sign in** with the email/password you created
2. **Explore the dashboard** - See all folders and datasets
3. **Click a dataset** - Open workspace with sidebar navigation
4. **Edit data** - Add rows, update cells
5. **Try different views** - Switch between Grid and Kanban
6. **Add your own data** - Create new folders and datasets!

---

## 🆘 Troubleshooting

### "Supabase not configured"
- Check `.env.local` has correct values
- Restart dev server: `Ctrl+C` then `npm run dev`

### "No data showing"
- Make sure you ran the seed script
- Check Supabase Dashboard → Table Editor
- Verify user ID matches in `.env.local`

### "Permission denied"
- RLS policies might not be set up
- Re-run the schema: `supabase/schema.sql`

### "Can't sign in"
- Check user exists in Supabase Auth
- Verify email/password are correct
- Check browser console for errors

---

## 📚 Full Documentation

- **Seed Instructions**: See `SEED_INSTRUCTIONS.md`
- **Profile & OTP Guide**: See `PROFILE_AND_OTP_GUIDE.md`
- **Next Steps**: See `NEXT_STEPS.md`

---

**Ready to build?** Your ZeroStack app is now connected to Supabase! 🎉
