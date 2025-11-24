# 🌱 Seed Script

Automatically populate your Supabase database with sample data!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Supabase client
- `dotenv` - Environment variable loader
- `ts-node` - TypeScript execution

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SEED_USER_ID=your-user-uid
```

**Where to find these:**
- **Project URL & Keys**: Supabase Dashboard → Settings → API
- **User UID**: Supabase Dashboard → Authentication → Users → Click user → Copy UID

### 3. Run the Seed

```bash
npm run seed
```

## ✅ What Gets Created

### 📁 **3 Folders**
1. **Amazon Returns** (Green) - `#10b981`
2. **Clients** (Blue) - `#3b82f6`
3. **Projects** (Purple) - `#8b5cf6`

### 📊 **9 Datasets with Real Data**

**Amazon Returns:**
- Returns Report (3 rows: Order ID, Product, Return Date, Reason, Refund Amount)
- Orders Report (3 rows: Order ID, Customer, Order Date, Status, Total)
- Inventory Report (3 rows: SKU, Product Name, Stock, Status, Price)

**Clients:**
- Client Contact List (3 rows: Company, Contact Person, Email, Status, Contract Value)
- Project Timeline (3 rows: Project, Client, Start Date, Status, Completion %)

**Projects:**
- Website Redesign (3 rows: Task, Status, Assignee, Due Date, Priority)
- Marketing Campaign (3 rows: Campaign, Platform, Budget, Start Date, Status)
- Product Launch (3 rows: Feature, Status, Owner, Release Date, Completion)
- Client Onboarding (3 rows: Step, Status, Responsible, Due Date, Notes)

### 📋 **18 Views**
- 2 views per dataset:
  - Grid View (default table view)
  - Kanban View (board view with grouping)

### 📈 **27 Rows of Sample Data**
- Each dataset has 3 rows of realistic data
- All data properly linked to your user ID
- Ready to view and edit immediately

## 🔄 Re-running the Seed

If you want to reset and re-seed:

### Option 1: Delete via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Delete rows from `views`, `tables`, and `folders` tables
3. Run `npm run seed` again

### Option 2: Delete via SQL

Run this in Supabase SQL Editor:

```sql
-- Replace with your actual user ID
DELETE FROM views WHERE user_id = 'your-user-id';
DELETE FROM tables WHERE user_id = 'your-user-id';
DELETE FROM folders WHERE user_id = 'your-user-id';
```

Then run:

```bash
npm run seed
```

## 📊 Verify the Data

After seeding:

1. **Check Supabase:**
   - Go to Table Editor
   - Verify `folders` has 3 rows
   - Verify `tables` has 9 rows
   - Verify `views` has 18 rows

2. **Check Your App:**
   - Open `http://localhost:3000`
   - Sign in with your seeded user
   - Go to Dashboard
   - See all 3 folders with datasets!

## ⚠️ Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install
```

### "User ID not found"
- Create a user in Supabase Auth first
- Copy the User UID correctly
- Update `SEED_USER_ID` in `.env.local`

### "Permission denied"
- Use **Service Role Key**, not Anon Key
- Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### "Table not found"
- Run database schema first: `supabase/schema.sql`
- Check all tables exist in Supabase

### "Duplicate key error"
- Data already exists
- Delete existing data first (see "Re-running the Seed")

## 🎯 Next Steps

After seeding:

1. ✅ Sign in to your app
2. ✅ Explore the dashboard
3. ✅ Click folders to see datasets
4. ✅ Open datasets in workspace
5. ✅ Try different views (Grid, Kanban)
6. ✅ Edit data and add your own!

---

**Need more help?** Check `SEED_INSTRUCTIONS.md` or `QUICK_START_SUPABASE.md`
