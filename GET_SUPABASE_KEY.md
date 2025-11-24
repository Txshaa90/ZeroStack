# 🔑 How to Get Your Supabase Anon Key

## 📍 You're Here:
https://supabase.com/dashboard/project/fcwpepubyyoanzqhcruo/settings/api

## ✅ Steps to Copy the Correct Key

### **1. Find the "anon" / "public" Key**

On the API settings page, you'll see:

```
API Key
┌─────────────────────────────────┐
│ anon                            │  ← This is just the label
│ public                          │
│                                 │
│ [Copy] button                   │  ← Click this!
└─────────────────────────────────┘
```

### **2. Click the "Copy" Button**

- Look for the **"Copy"** button next to the anon/public key
- It will copy a LONG string (200+ characters)
- The key should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd3BlcHVieXlvYW56cWhjcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDI0NzAsImV4cCI6MjA0NzAxODQ3MH0.Y5DlRydhseDOGZd7chrmjQ0owSAF_9WEuCTcJyGJOCM`

### **3. Verify It's the Right Key**

The anon key should:
- ✅ Start with `eyJ`
- ✅ Be about 200+ characters long
- ✅ Have three parts separated by dots (`.`)
- ✅ Be labeled as "anon" or "public" (NOT "service_role")

## 🚨 Important: Don't Use Service Role Key!

There are TWO keys on that page:

1. **anon / public** ← Use this one! ✅
   - Safe for browser/client-side
   - Respects Row Level Security
   - This is what you need

2. **service_role** ← DON'T use this! ❌
   - Bypasses all security
   - Should only be used server-side
   - Never expose in browser

## 📋 What to Do After Copying

### **Option 1: Tell Me the Key**
Paste the key here and I'll update your `.env.local` file

### **Option 2: Update Manually**
1. Open `c:\Users\Admin\ZeroStack\.env.local`
2. Replace the current `NEXT_PUBLIC_SUPABASE_ANON_KEY` value
3. Make sure there are NO spaces or line breaks
4. Save the file
5. Restart dev server: `npm run dev`

## 📝 Example `.env.local` Format

```env
NEXT_PUBLIC_SUPABASE_URL=https://fcwpepubyyoanzqhcruo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjd3BlcHVieXlvYW56cWhjcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDI0NzAsImV4cCI6MjA0NzAxODQ3MH0.Y5DlRydhseDOGZd7chrmjQ0owSAF_9WEuCTcJyGJOCM
```

**Important**: 
- No quotes around the values
- No spaces before or after the `=`
- Each variable on its own line
- No extra blank lines

## 🔍 How to Verify

After updating:

1. Visit: http://localhost:3000/debug-env
2. Check that "Key Length" shows ~200+ characters
3. Check that key starts with `eyJ`
4. Then test: http://localhost:3000/test-supabase

---

**Next Step**: Copy the anon/public key from Supabase dashboard and paste it here! 🔑
