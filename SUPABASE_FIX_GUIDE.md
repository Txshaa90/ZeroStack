# 🔧 Supabase Connection Fix Guide

## ✅ Step 1: Environment Variables (FIXED!)

Your `.env.local` now has the complete anon key:
```
NEXT_PUBLIC_SUPABASE_URL=https://fcwpepubyyoanzqhcruo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd3BlcHVieXlvYW56cWhjcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDI0NzAsImV4cCI6MjA0NzAxODQ3MH0.Y5DlRydhseDOGZd7chrmjQ0owSAF_9WEuCTcJyGJOCM
```

✅ Dev server restarted - environment variables loaded!

---

## 🎯 Step 2: Create Database Tables (DO THIS NOW!)

### **Option A: Using Supabase Dashboard (Recommended)**

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/fcwpepubyyoanzqhcruo/sql
   - Click **"New Query"**

2. **Copy the Schema**:
   - Open `c:\Users\Admin\ZeroStack\supabase\schema.sql` in your editor
   - Select ALL (Ctrl+A)
   - Copy (Ctrl+C)

3. **Run the Schema**:
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or Ctrl+Enter)
   - Wait for "Success. No rows returned"

4. **Verify Tables Were Created**:
   - Go to **Table Editor** in Supabase sidebar
   - You should see 3 tables:
     - ✅ `folders`
     - ✅ `tables`
     - ✅ `views`

### **What the Schema Creates:**

```sql
-- 3 Tables
✅ folders   - For organizing datasets
✅ tables    - For storing datasets with columns/rows
✅ views     - For grid/gallery/form views

-- Row Level Security (RLS)
✅ Policies for each table
✅ Users can only see their own data

-- Performance
✅ Indexes on user_id and foreign keys
✅ Auto-updating timestamps
```

---

## 🔍 Step 3: Test the Connection

After running the schema:

1. Visit: http://localhost:3000/test-supabase
2. You should see:
   - ✅ **Environment Variables**: Configured ✓
   - ✅ **Database Connection**: Connected successfully ✓
   - 🎉 **Success message**

---

## 🔐 Step 4: Verify RLS Policies (Already Included!)

The schema automatically creates RLS policies. To verify:

1. Go to Supabase → **Authentication** → **Policies**
2. Select `folders` table
3. You should see policies like:
   - ✅ "Users can view their own folders"
   - ✅ "Users can insert their own folders"
   - ✅ "Users can update their own folders"
   - ✅ "Users can delete their own folders"

These policies ensure users can only access their own data!

---

## 🎯 Step 5: Test End-to-End

### **A. Sign Up**
1. Visit: http://localhost:3000/auth/signup
2. Sign up with email or Google
3. Check email for verification (if using email)

### **B. Sign In**
1. Visit: http://localhost:3000/auth/signin
2. Sign in with your account
3. You should be redirected to `/dashboard`

### **C. Create Data**
1. In dashboard, click **"New Folder"**
2. Name it "Test Folder"
3. Click **"Create Folder"**

### **D. Verify in Supabase**
1. Go to Supabase → **Table Editor** → **folders**
2. You should see your "Test Folder"! 🎉
3. Note the `user_id` matches your auth user

---

## 🚨 Troubleshooting

### Error: "relation 'folders' does not exist"
**Cause**: Database tables not created
**Fix**: Run Step 2 above (create tables with schema.sql)

### Error: "Invalid API key"
**Cause**: Wrong or truncated anon key
**Fix**: ✅ Already fixed! Key is now complete in `.env.local`

### Error: "new row violates row-level security policy"
**Cause**: Not signed in, or RLS policies not created
**Fix**: 
- Make sure you're signed in
- Run the schema.sql (includes RLS policies)

### Error: "Failed to fetch"
**Cause**: Supabase project paused or wrong URL
**Fix**: 
- Check project is active in Supabase dashboard
- Verify URL in `.env.local` is correct

### Can't sign in / "Invalid credentials"
**Fix**:
- Check email for verification link
- Try Google OAuth instead
- Reset password if needed

---

## ✅ Checklist

Before testing:
- [x] ✅ `.env.local` has correct URL and complete anon key
- [x] ✅ Dev server restarted
- [ ] ⏳ Database schema run in Supabase SQL Editor
- [ ] ⏳ Tables visible in Table Editor
- [ ] ⏳ Test connection at `/test-supabase`
- [ ] ⏳ Sign up and create test data

---

## 🎉 Once Everything Works

Your ZeroStack will:
- ✅ Store all data in Supabase (cloud)
- ✅ Sync across devices in real-time
- ✅ Require authentication
- ✅ Keep user data private with RLS
- ✅ Work in production when deployed

---

## 📍 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/fcwpepubyyoanzqhcruo
- **SQL Editor**: https://supabase.com/dashboard/project/fcwpepubyyoanzqhcruo/sql
- **Table Editor**: https://supabase.com/dashboard/project/fcwpepubyyoanzqhcruo/editor
- **Test Page**: http://localhost:3000/test-supabase
- **Sign Up**: http://localhost:3000/auth/signup

---

**Next Action**: Run the database schema (Step 2)! 🚀
