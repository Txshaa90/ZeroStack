# 🌱 Supabase Seed Instructions

This guide will help you populate your Supabase database with sample data.

## 📋 Prerequisites

1. **Supabase Project** - You need a Supabase project set up
2. **Database Schema** - Run the schema from `supabase/schema.sql` first
3. **User Account** - Create a user account in Supabase Auth

## 🔑 Step 1: Get Your Credentials

### Get Your User ID

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click on your user
4. Copy the **User UID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Get Your Service Role Key

1. Go to **Settings** → **API**
2. Find **Service Role Key** (secret)
3. Copy it (keep it secure!)

## 🛠️ Step 2: Set Up Environment Variables

Create or update your `.env.local` file:

```bash
# Your existing variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Add these for seeding
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SEED_USER_ID=your-user-id-from-step-1
```

## 📦 Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install --save-dev ts-node @types/node
```

## 🚀 Step 4: Run the Seed Script

```bash
# Option 1: Using ts-node directly
npx ts-node scripts/seed.ts

# Option 2: Using npm script (add to package.json first)
npm run seed
```

### Add to package.json

Add this to your `scripts` section in `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node scripts/seed.ts"
  }
}
```

## ✅ What Gets Created

### 📁 **3 Folders**
1. **Amazon Returns** (Green)
2. **Clients** (Blue)
3. **Projects** (Purple)

### 📊 **9 Datasets**

**Amazon Returns:**
- Returns Report (3 rows)
- Orders Report (3 rows)
- Inventory Report (3 rows)

**Clients:**
- Client Contact List (3 rows)
- Project Timeline (3 rows)

**Projects:**
- Website Redesign (3 rows)
- Marketing Campaign (3 rows)
- Product Launch (3 rows)
- Client Onboarding (3 rows)

### 📋 **18 Views**
- 2 views per dataset (Grid View + Kanban View)

### 📈 **27 Rows of Data**
- Real sample data with proper columns and values

## 🔍 Verify the Data

After running the seed:

1. Go to your Supabase Dashboard
2. Navigate to **Table Editor**
3. Check these tables:
   - `folders` - Should have 3 rows
   - `tables` - Should have 9 rows
   - `views` - Should have 18 rows

## 🌐 View in Your App

1. Open your ZeroStack app: `http://localhost:3000`
2. Sign in with the user account you used for seeding
3. Go to Dashboard
4. You should see all 3 folders with datasets!

## 🔄 Re-running the Seed

If you want to reset and re-seed:

1. **Clear existing data:**
   ```sql
   -- Run in Supabase SQL Editor
   DELETE FROM views WHERE user_id = 'your-user-id';
   DELETE FROM tables WHERE user_id = 'your-user-id';
   DELETE FROM folders WHERE user_id = 'your-user-id';
   ```

2. **Run seed again:**
   ```bash
   npm run seed
   ```

## ⚠️ Troubleshooting

### "User ID not found"
- Make sure you've created a user in Supabase Auth
- Double-check the User UID is correct

### "Permission denied"
- Make sure you're using the **Service Role Key**, not the Anon Key
- Check that RLS policies are set up correctly

### "Table not found"
- Run the database schema first: `supabase/schema.sql`
- Make sure all tables exist in your database

### "Duplicate key error"
- Data already exists
- Clear existing data first (see "Re-running the Seed" above)

## 🎯 Next Steps

After seeding:

1. ✅ Sign in to your app
2. ✅ Explore the dashboard
3. ✅ Click on folders to see datasets
4. ✅ Open datasets to view/edit data
5. ✅ Try different views (Grid, Kanban)
6. ✅ Add your own data!

---

**Need help?** Check the console output when running the seed script for detailed error messages.
