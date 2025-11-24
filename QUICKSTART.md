# ZeroStack Quick Start Guide

Get ZeroStack up and running in minutes!

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zerostack.git
cd zerostack

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Basic Usage

### 1. Create Your First Table

1. Navigate to `/workspace`
2. Click **"New Table"** button
3. Enter a name (e.g., "Customers")
4. Click **"Create Table"**

### 2. Add Columns

1. Click **"Add Column"** in the table header
2. Enter column name (e.g., "Email")
3. Select column type (Text, Number, Date, etc.)
4. Click **"Add Column"**

### 3. Add Data

1. Click **"Add Row"** to create a new row
2. Click on any cell to edit
3. Data is automatically saved

### 4. Import Data

1. Click **"Import CSV"** in the sidebar
2. Select your CSV file
3. Data will be mapped to existing columns

### 5. Export Data

1. Click the **three dots** next to table name
2. Select **"Export CSV"** or **"Export JSON"**
3. File will download automatically

## 🎨 Using Dark Mode

Click the **sun/moon icon** in the header to toggle between:
- Light mode
- Dark mode
- System preference

## 🔍 Search & Filter

Use the **search bar** in the header to filter rows across all columns in real-time.

## 📊 Sorting

Click the **sort icon** in any column header to sort data:
- First click: Ascending
- Second click: Descending
- Third click: Remove sort

## 💡 Pro Tips

### Keyboard Shortcuts
- `Tab` - Move to next cell
- `Enter` - Move to cell below
- `Esc` - Exit cell editing

### Data Types
- **Text**: Any string value
- **Number**: Numeric values only
- **Date**: Date picker
- **Select**: Dropdown with predefined options
- **Checkbox**: True/false values
- **Email**: Email validation
- **URL**: URL validation

### CSV Import Format
```csv
Name,Email,Status
John Doe,john@example.com,Active
Jane Smith,jane@example.com,Pending
```

Make sure your CSV headers match your column names (case-insensitive).

## 🛠️ Development

### Project Structure
```
zerostack/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── workspace/         # Workspace app
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── store/                # Zustand stores
│   └── useTableStore.ts
└── lib/                  # Utilities
    ├── utils.ts
    └── csv-utils.ts
```

### State Management

```typescript
import { useTableStore } from '@/store/useTableStore'

function MyComponent() {
  const { tables, addTable, activeTableId } = useTableStore()
  
  // Add a new table
  const handleCreate = () => {
    addTable('My New Table')
  }
  
  return <button onClick={handleCreate}>Create</button>
}
```

### API Routes

All API routes are located in `/app/api/tables/`:

```typescript
// GET all tables
fetch('/api/tables')

// POST new table
fetch('/api/tables', {
  method: 'POST',
  body: JSON.stringify({ name: 'New Table' })
})

// GET specific table
fetch('/api/tables/[id]')

// DELETE table
fetch('/api/tables/[id]', { method: 'DELETE' })
```

### Adding Custom Column Types

Edit `/store/useTableStore.ts`:

```typescript
export type ColumnType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'select' 
  | 'checkbox'
  | 'email'
  | 'url'
  | 'your-custom-type'  // Add here
```

Then update the UI in `/app/workspace/page.tsx`:

```tsx
<SelectContent>
  <SelectItem value="text">Text</SelectItem>
  <SelectItem value="your-custom-type">Your Custom Type</SelectItem>
</SelectContent>
```

## 🔌 Backend Integration

### Step 1: Set up Database

Create a PostgreSQL database and add connection string to `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zerostack"
```

### Step 2: Update API Routes

Modify `/app/api/tables/route.ts`:

```typescript
import { db } from '@/lib/db'

export async function GET() {
  const tables = await db.table.findMany()
  return NextResponse.json({ tables })
}
```

### Step 3: Sync Zustand with API

Update store actions to call API:

```typescript
addTable: async (name) => {
  const response = await fetch('/api/tables', {
    method: 'POST',
    body: JSON.stringify({ name })
  })
  const { table } = await response.json()
  set((state) => ({ tables: [...state.tables, table] }))
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Issue: Data not persisting
**Solution**: Check browser localStorage. Clear it and refresh if needed.

### Issue: CSV import not working
**Solution**: Ensure CSV headers match column names exactly (case-insensitive).

### Issue: Dark mode not working
**Solution**: Clear localStorage and refresh. Check system preferences.

### Issue: TypeScript errors
**Solution**: Run `npm install` to ensure all dependencies are installed.

## 📚 Additional Resources

- [Full Documentation](./ENHANCEMENTS.md)
- [API Reference](./API.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## 💬 Support

- GitHub Issues: [Report a bug](https://github.com/yourusername/zerostack/issues)
- Discord: [Join our community](https://discord.gg/zerostack)
- Email: support@zerostack.com

## 🎯 Next Steps

1. ✅ Complete this quick start
2. 📖 Read [ENHANCEMENTS.md](./ENHANCEMENTS.md) for advanced features
3. 🔌 Integrate with your backend
4. 🚀 Deploy to production
5. 🤝 Contribute back to the project

---

**Happy Building!** 🎉
