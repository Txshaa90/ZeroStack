# Multi-Sheet System Guide

## Overview
ZeroStack now has a comprehensive multi-sheet system similar to Google Sheets, where each dataset can have multiple independent sheets with their own data, views, and settings.

## ✨ Features Implemented

### 1. **Sheet Sidebar** 📋
- **Location**: Left sidebar in workspace view
- **Features**:
  - Visual list of all sheets in the dataset
  - Sheet icons based on type (Grid, Gallery, Form, Kanban, Calendar)
  - Row count display for each sheet
  - Active sheet highlighting
  - Quick sheet switching

### 2. **Add New Sheet** ➕
- **Button Locations**: 
  - Top of sidebar (+ icon)
  - Bottom of sidebar ("New Sheet" button)
- **Behavior**:
  - Creates a new sheet with default settings
  - Initializes with all columns visible
  - Empty row data
  - Automatically switches to the new sheet
  - Persists to Supabase immediately

### 3. **Rename Sheet** ✏️
- **Access**: Click ⋮ menu on any sheet → "Rename"
- **Behavior**:
  - Inline editing with text input
  - Press Enter to save
  - Press Escape to cancel
  - Updates Supabase immediately

### 4. **Delete Sheet** 🗑️
- **Access**: Click ⋮ menu on any sheet → "Delete"
- **Protection**:
  - Cannot delete the last sheet
  - Confirmation dialog before deletion
  - Automatically switches to first sheet if active sheet is deleted
- **Behavior**: Removes from Supabase and updates UI

### 5. **Duplicate Sheet** 📋
- **Access**: Click ⋮ menu on any sheet → "Duplicate"
- **Behavior**:
  - Creates exact copy with "(Copy)" suffix
  - Copies all settings:
    - Visible columns
    - Filters
    - Sorts
    - Group by
    - Color rules
    - **Row data** (independent copy)
  - Switches to the duplicated sheet

### 6. **Independent Row Data** 🔢
- Each sheet now has its own `rows` array
- Sheets can have completely different data
- Fallback to dataset rows if sheet rows are empty
- Full CRUD operations per sheet

## 🗄️ Database Schema

### Updated `views` Table
```sql
create table views (
  id uuid primary key,
  user_id uuid references auth.users(id),
  table_id uuid references tables(id),
  name text not null,
  type text not null,
  filters jsonb default '[]'::jsonb,
  sorts jsonb default '[]'::jsonb,
  color_rules jsonb default '[]'::jsonb,
  visible_columns jsonb default '[]'::jsonb,
  group_by text,
  rows jsonb default '[]'::jsonb,  -- NEW: Per-sheet row data
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 📊 Data Structure

### Sheet Object
```typescript
{
  id: string
  name: string
  type: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
  visible_columns: string[]
  filters: Array<{
    columnId: string
    operator: 'equals' | 'contains' | 'not_contains' | 'gt' | 'lt'
    value: any
  }>
  sorts: Array<{
    field: string
    direction: 'asc' | 'desc'
  }>
  color_rules: Array<{
    columnId: string
    value: string
    color: string
  }>
  group_by: string | null
  rows: Array<Record<string, any>>  // Independent row data
}
```

## 🎯 Usage Examples

### Creating a New Sheet
1. Click the "+" button in the sidebar header
2. Or click "New Sheet" button at the bottom
3. New sheet appears with name "Sheet N"
4. Automatically switches to the new sheet

### Organizing Data Across Sheets
**Example: Sales Dataset**
- **Sheet 1**: "All Sales" - Complete data
- **Sheet 2**: "Q1 Sales" - Filtered for Q1
- **Sheet 3**: "Top Performers" - Sorted by revenue
- **Sheet 4**: "Regional View" - Grouped by region

Each sheet can have:
- Different visible columns
- Different filters
- Different sorting
- Different grouping
- Different color rules
- **Different row data**

### Duplicating for Templates
1. Set up a sheet with desired filters/views
2. Click ⋮ → "Duplicate"
3. Rename the copy
4. Modify data independently

## 🔄 Data Flow

```
User Action
    ↓
Sheet Sidebar Component
    ↓
Handler Function (handleAddSheet, handleRenameSheet, etc.)
    ↓
Supabase Update
    ↓
Local State Update
    ↓
UI Re-render
```

## 🚀 Future Enhancements

- [ ] Drag-and-drop sheet reordering
- [ ] Sheet templates
- [ ] Import/export sheets
- [ ] Sheet-level permissions
- [ ] Sheet history/versioning
- [ ] Bulk sheet operations
- [ ] Sheet search/filter

## 🔧 Technical Details

### Components
- **SheetSidebar** (`components/sheet-sidebar.tsx`) - Main sidebar component
- **WorkspaceToolbar** (`components/workspace-toolbar.tsx`) - Fields/Filter/Group/Sort/Colour controls
- **DatasetWorkspacePage** (`app/workspace/[datasetId]/page.tsx`) - Main workspace page

### Key Functions
- `handleAddSheet()` - Creates new sheet
- `handleRenameSheet(sheetId, newName)` - Renames sheet
- `handleDeleteSheet(sheetId)` - Deletes sheet
- `handleDuplicateSheet(sheetId)` - Duplicates sheet
- `getFilteredRows()` - Processes sheet data with filters/sorts

### State Management
- `supabaseViews` - Array of sheets from Supabase
- `activeSheetId` - Currently selected sheet
- Local state for temporary changes before persistence

## 📝 Migration Notes

### Adding `rows` Column to Existing Database
Run this SQL in your Supabase SQL editor:

```sql
ALTER TABLE views ADD COLUMN IF NOT EXISTS rows jsonb DEFAULT '[]'::jsonb NOT NULL;
```

This adds the `rows` column to support per-sheet data.

## 🎨 UI/UX Features

- **Hover Effects**: Sheet items highlight on hover
- **Active Indication**: Primary color for active sheet
- **Row Count Badge**: Shows number of rows per sheet
- **Icon Indicators**: Different icons for sheet types
- **Smooth Transitions**: Animated state changes
- **Inline Editing**: Quick rename without modal
- **Context Menu**: Clean ⋮ menu for actions

## 🔐 Permissions

All sheet operations respect Row Level Security (RLS):
- Users can only see their own sheets
- Users can only modify their own sheets
- Sheets are automatically linked to the user who created them

## 💡 Best Practices

1. **Naming**: Use descriptive sheet names
2. **Organization**: Group related data in separate sheets
3. **Performance**: Keep row counts reasonable per sheet
4. **Backups**: Duplicate important sheets before major changes
5. **Cleanup**: Delete unused sheets to keep workspace tidy

## 🐛 Troubleshooting

**Sheet not appearing after creation?**
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies

**Cannot delete sheet?**
- Must have at least one sheet per dataset
- Check if you have permission

**Changes not saving?**
- Check network tab for failed requests
- Verify Supabase credentials
- Check RLS policies

---

**Last Updated**: November 13, 2025
**Version**: 1.0.0
