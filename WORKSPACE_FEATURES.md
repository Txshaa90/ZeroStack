# Workspace Features Guide

## Overview
The ZeroStack workspace page now supports advanced data manipulation features including filtering, grouping, sorting, and color coding.

## Features Implemented

### 1. **Filter** 🔍
Filter rows based on column values with multiple operators:
- `equals` - Exact match
- `contains` - Contains text
- `not_contains` - Does not contain text
- `gt` - Greater than (for numbers)
- `lt` - Less than (for numbers)

**Example:**
```typescript
filters: [
  { columnId: 'status', operator: 'equals', value: 'Active' },
  { columnId: 'priority', operator: 'contains', value: 'High' }
]
```

### 2. **Group** 📊
Group rows by a selected column. Rows are organized into collapsible groups with headers showing:
- Group name
- Number of rows in the group

**Example:**
```typescript
group_by: 'status' // Groups by the 'status' column
```

**Result:**
- All rows with status "Active" appear under "Active" group
- All rows with status "Pending" appear under "Pending" group
- Rows without a value appear under "Ungrouped"

### 3. **Sort** ↕️
Sort rows by column in ascending or descending order:
- Supports text, number, and date sorting
- Multiple sort levels supported

**Example:**
```typescript
sorts: [
  { field: 'priority', direction: 'desc' },
  { field: 'name', direction: 'asc' }
]
```

### 4. **Colour** 🎨
Apply background colors to rows based on column values:

**Built-in Color Mapping:**
- `High` / `Urgent` → Red (rgb(254 202 202))
- `Medium` → Yellow (rgb(254 249 195))
- `Low` → Green (rgb(187 247 208))
- `Completed` / `Done` → Green (rgb(187 247 208))
- `In Progress` / `Active` → Blue (rgb(191 219 254))
- `Pending` → Yellow (rgb(254 249 195))

**Custom Color Rules:**
```typescript
color_rules: [
  { columnId: 'status', value: 'Urgent', color: '#ff0000' },
  { columnId: 'priority', value: 'Low', color: '#00ff00' }
]
```

## Data Flow

```
Raw Data (currentDataset.rows)
    ↓
Apply Filters (based on currentSheet.filters)
    ↓
Apply Sorting (based on currentSheet.sorts)
    ↓
Group Rows (based on currentSheet.group_by)
    ↓
Apply Colors (based on currentSheet.color_rules)
    ↓
Render Grouped Tables with Colored Rows
```

## View Configuration

Each view (sheet) in Supabase can have:

```typescript
{
  id: string
  name: string
  type: 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
  visible_columns: string[]      // Which columns to show
  filters: Filter[]               // Row filters
  sorts: Sort[]                   // Sort configuration
  group_by: string | null         // Column to group by
  color_rules: ColorRule[]        // Color coding rules
}
```

## Example Usage

### Simple Filter View
```typescript
{
  name: "Active Tasks",
  filters: [
    { columnId: 'status', operator: 'equals', value: 'Active' }
  ]
}
```

### Grouped and Sorted View
```typescript
{
  name: "Tasks by Priority",
  group_by: 'priority',
  sorts: [
    { field: 'due_date', direction: 'asc' }
  ]
}
```

### Color-Coded View
```typescript
{
  name: "Priority Dashboard",
  color_rules: [
    { columnId: 'priority', value: 'High', color: 'rgb(254 202 202)' },
    { columnId: 'priority', value: 'Medium', color: 'rgb(254 249 195)' },
    { columnId: 'priority', value: 'Low', color: 'rgb(187 247 208)' }
  ]
}
```

## UI Components

### Toolbar Buttons
Located below the sheet tabs:
- **Fields** - Manage visible columns
- **Filter** - Add/edit row filters
- **Group** - Group rows by column
- **Sort** - Configure sorting
- **Colour** - Set up color rules

### Group Headers
When grouping is active, each group displays:
- Folder icon
- Group name
- Row count badge
- Collapsible table

## Technical Implementation

### Key Functions

1. **getFilteredRows()** - Applies filters and sorts
2. **groupedRows** - Groups filtered rows by column
3. **rowsWithColor** - Adds color property to each row
4. **getRowColor()** - Determines row color based on value

### Data Structure

```typescript
// Grouped and colored data structure
{
  "High Priority": [
    { id: 1, name: "Task 1", rowColor: "rgb(254 202 202)" },
    { id: 2, name: "Task 2", rowColor: "rgb(254 202 202)" }
  ],
  "Medium Priority": [
    { id: 3, name: "Task 3", rowColor: "rgb(254 249 195)" }
  ]
}
```

## Future Enhancements

- [ ] Interactive UI for adding filters
- [ ] Drag-and-drop column reordering
- [ ] Custom color picker
- [ ] Advanced filter operators (date ranges, regex)
- [ ] Save filter presets
- [ ] Export filtered/grouped data

## Notes

- All features work with Supabase-backed data
- Changes to filters/sorts/groups are stored in the view configuration
- Color coding is visual only and doesn't affect data
- Grouping creates separate tables for better organization
