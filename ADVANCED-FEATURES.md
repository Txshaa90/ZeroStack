# Advanced Features - Filtering, Conditional Coloring & Views

This document explains the advanced Airtable-like features implemented in ZeroStack.

## 🎯 Overview

ZeroStack now supports:
1. **Advanced Filtering** - Multi-condition filtering with 12+ operators
2. **Conditional Coloring** - Visual highlighting based on data values
3. **Field Selection** - Show/hide columns per view
4. **Multiple Views** - Grid, Gallery, Form, Kanban, Calendar

---

## 1️⃣ Advanced Filtering System

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | Status equals "Completed" |
| `not_equals` | Not equal to | Priority not equals "Low" |
| `contains` | Contains text | Name contains "Project" |
| `not_contains` | Does not contain | Description not contains "urgent" |
| `starts_with` | Starts with text | Email starts with "admin" |
| `ends_with` | Ends with text | URL ends with ".com" |
| `is_empty` | Field is empty | Notes is empty |
| `is_not_empty` | Field has value | Assignee is not empty |
| `gt` | Greater than | Budget > 10000 |
| `lt` | Less than | Days < 30 |
| `gte` | Greater than or equal | Score >= 80 |
| `lte` | Less than or equal | Age <= 65 |

### Filter Data Structure

```typescript
interface FilterCondition {
  id: string
  columnId: string
  operator: FilterOperator
  value: string | number | boolean | Date
}
```

### Usage Example

```typescript
import { useViewStore } from '@/store/useViewStore-enhanced'
import { applyFilters } from '@/lib/filter-utils'

// Add a filter
const { addFilter } = useViewStore()
addFilter(viewId, {
  columnId: 'status',
  operator: 'equals',
  value: 'Completed'
})

// Apply filters to rows
const filteredRows = applyFilters(rows, currentView.filters)
```

### Filter Logic

- **AND Logic**: All filters must match (default)
- Filters are applied sequentially
- Empty value operators (`is_empty`, `is_not_empty`) don't require a value

### Column Type-Specific Operators

**Text/Email/URL**:
- equals, not_equals, contains, not_contains
- starts_with, ends_with
- is_empty, is_not_empty

**Number**:
- equals, not_equals
- gt, lt, gte, lte
- is_empty, is_not_empty

**Date**:
- equals, not_equals
- gt, lt (for date comparisons)
- is_empty, is_not_empty

**Select/Checkbox**:
- equals, not_equals
- is_empty, is_not_empty

---

## 2️⃣ Conditional Coloring

### Color Rule Structure

```typescript
interface ColorRule {
  id: string
  columnId: string
  operator: FilterOperator
  value: string | number | boolean | Date
  color: string        // Tailwind background class
  textColor?: string   // Optional text color class
}
```

### Available Colors

| Color | Background Class | Text Class |
|-------|-----------------|------------|
| Red | `bg-red-100 dark:bg-red-900/30` | `text-red-900 dark:text-red-100` |
| Orange | `bg-orange-100 dark:bg-orange-900/30` | `text-orange-900 dark:text-orange-100` |
| Yellow | `bg-yellow-100 dark:bg-yellow-900/30` | `text-yellow-900 dark:text-yellow-100` |
| Green | `bg-green-100 dark:bg-green-900/30` | `text-green-900 dark:text-green-100` |
| Blue | `bg-blue-100 dark:bg-blue-900/30` | `text-blue-900 dark:text-blue-100` |
| Purple | `bg-purple-100 dark:bg-purple-900/30` | `text-purple-900 dark:text-purple-100` |
| Pink | `bg-pink-100 dark:bg-pink-900/30` | `text-pink-900 dark:text-pink-100` |
| Gray | `bg-gray-100 dark:bg-gray-700` | `text-gray-900 dark:text-gray-100` |

### Usage Example

```typescript
import { useViewStore } from '@/store/useViewStore-enhanced'
import { getRowColorClasses } from '@/lib/filter-utils'

// Add a color rule
const { addColorRule } = useViewStore()
addColorRule(viewId, {
  columnId: 'status',
  operator: 'equals',
  value: 'Completed',
  color: 'bg-green-100 dark:bg-green-900/30',
  textColor: 'text-green-900 dark:text-green-100'
})

// Apply color to row
const { background, text } = getRowColorClasses(row, currentView.colorRules)
```

### Color Rule Priority

- **First match wins**: If multiple rules match, the first one is applied
- Rules are evaluated in the order they were created
- Reorder rules to change priority (future feature)

### Use Cases

**Status-based coloring**:
```typescript
// Green for completed
{ columnId: 'status', operator: 'equals', value: 'Completed', color: 'bg-green-100' }

// Red for overdue
{ columnId: 'status', operator: 'equals', value: 'Overdue', color: 'bg-red-100' }

// Yellow for in progress
{ columnId: 'status', operator: 'equals', value: 'In Progress', color: 'bg-yellow-100' }
```

**Priority-based coloring**:
```typescript
// Red for high priority
{ columnId: 'priority', operator: 'equals', value: 'High', color: 'bg-red-100' }

// Orange for medium
{ columnId: 'priority', operator: 'equals', value: 'Medium', color: 'bg-orange-100' }
```

**Value-based coloring**:
```typescript
// Green for budget over 50000
{ columnId: 'budget', operator: 'gt', value: 50000, color: 'bg-green-100' }

// Red for budget under 10000
{ columnId: 'budget', operator: 'lt', value: 10000, color: 'bg-red-100' }
```

---

## 3️⃣ Field Selection (Column Visibility)

### Per-View Column Visibility

Each view maintains its own list of visible columns:

```typescript
interface View {
  id: string
  name: string
  visibleColumns: string[]  // Array of column IDs
  // ... other properties
}
```

### Operations

```typescript
const { 
  toggleColumnVisibility,
  setVisibleColumns,
  showAllColumns,
  hideAllColumns 
} = useViewStore()

// Toggle a single column
toggleColumnVisibility(viewId, columnId)

// Set specific columns
setVisibleColumns(viewId, ['col1', 'col2', 'col3'])

// Show all columns
showAllColumns(viewId, allColumnIds)

// Hide all columns
hideAllColumns(viewId)
```

### Rendering Visible Columns

```typescript
const visibleColumns = currentTable.columns.filter(
  col => currentView.visibleColumns.includes(col.id)
)

// Render only visible columns
{visibleColumns.map(column => (
  <th key={column.id}>{column.name}</th>
))}
```

### Use Cases

- **Simplified views**: Hide technical columns for end users
- **Focus views**: Show only relevant columns for specific tasks
- **Print views**: Hide unnecessary columns before printing
- **Mobile views**: Show fewer columns on small screens

---

## 4️⃣ Multiple Views Per Table

### View Types

```typescript
type ViewType = 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'
```

### View Structure

```typescript
interface View {
  id: string
  name: string
  type: ViewType
  tableId: string
  filters: FilterCondition[]
  sorts: Sort[]
  colorRules: ColorRule[]
  visibleColumns: string[]
  groupBy?: string
  createdAt: string
  updatedAt: string
}
```

### Creating Views

```typescript
const { addView } = useViewStore()

// Create a grid view
addView(tableId, 'All Projects', 'grid', allColumnIds)

// Create a filtered view
addView(tableId, 'Active Projects', 'grid', allColumnIds)
// Then add filters
addFilter(newViewId, {
  columnId: 'status',
  operator: 'not_equals',
  value: 'Completed'
})
```

### View Examples

**1. Grid View - All Records**
```typescript
{
  name: 'All Records',
  type: 'grid',
  filters: [],
  visibleColumns: allColumnIds
}
```

**2. Grid View - Active Only**
```typescript
{
  name: 'Active Projects',
  type: 'grid',
  filters: [
    { columnId: 'status', operator: 'not_equals', value: 'Completed' }
  ],
  colorRules: [
    { columnId: 'priority', operator: 'equals', value: 'High', color: 'bg-red-100' }
  ]
}
```

**3. Grid View - High Priority**
```typescript
{
  name: 'High Priority',
  type: 'grid',
  filters: [
    { columnId: 'priority', operator: 'equals', value: 'High' }
  ],
  sorts: [
    { field: 'dueDate', direction: 'asc' }
  ]
}
```

**4. Gallery View - Portfolio**
```typescript
{
  name: 'Portfolio',
  type: 'gallery',
  visibleColumns: ['thumbnail', 'title', 'category'],
  colorRules: []
}
```

---

## 🎨 UI Components

### Filter Builder Modal

```tsx
import { FilterBuilder } from '@/components/filter-builder'

<FilterBuilder
  open={showFilterModal}
  onOpenChange={setShowFilterModal}
  columns={currentTable.columns}
  filters={currentView.filters}
  onAddFilter={(filter) => addFilter(currentView.id, filter)}
  onUpdateFilter={(id, updates) => updateFilter(currentView.id, id, updates)}
  onRemoveFilter={(id) => removeFilter(currentView.id, id)}
  onClearFilters={() => clearFilters(currentView.id)}
/>
```

### Color Rule Builder Modal

```tsx
import { ColorRuleBuilder } from '@/components/color-rule-builder'

<ColorRuleBuilder
  open={showColorModal}
  onOpenChange={setShowColorModal}
  columns={currentTable.columns}
  colorRules={currentView.colorRules}
  onAddColorRule={(rule) => addColorRule(currentView.id, rule)}
  onRemoveColorRule={(id) => removeColorRule(currentView.id, id)}
  onClearColorRules={() => clearColorRules(currentView.id)}
/>
```

---

## 🔧 Implementation Details

### Filter Application Flow

```
1. User adds filter via FilterBuilder
2. Filter stored in View state (Zustand)
3. applyFilters() called with current rows
4. Each row tested against all filters (AND logic)
5. Filtered rows rendered in table
```

### Color Application Flow

```
1. User adds color rule via ColorRuleBuilder
2. Rule stored in View state
3. For each row, getRowColorClasses() called
4. First matching rule determines row color
5. Tailwind classes applied to <tr> element
```

### Performance Considerations

- **Client-side filtering**: Fast for < 10,000 rows
- **Memoization**: Use `useMemo` for filtered/sorted data
- **Virtual scrolling**: Recommended for > 1,000 rows
- **Server-side**: Move to API for > 10,000 rows

### State Persistence

All view configurations are persisted to localStorage:
- Filters
- Color rules
- Visible columns
- Sorts
- View type

---

## 📝 Best Practices

### Filtering
1. **Start broad, refine narrow**: Begin with simple filters, add more as needed
2. **Use appropriate operators**: `contains` for text search, `equals` for exact match
3. **Combine filters**: Use multiple filters for complex queries
4. **Clear unused filters**: Remove filters when no longer needed

### Conditional Coloring
1. **Limit rules**: 3-5 color rules per view is optimal
2. **Use contrasting colors**: Ensure colors are distinguishable
3. **Consider dark mode**: Test colors in both themes
4. **Priority order**: Most important rules first

### Field Selection
1. **Create focused views**: Hide irrelevant columns
2. **Save common layouts**: Create views for different use cases
3. **Mobile optimization**: Fewer columns for mobile views

### Multiple Views
1. **Descriptive names**: "Active High Priority" vs "View 1"
2. **Purpose-driven**: Each view should serve a specific purpose
3. **Avoid duplication**: Don't create redundant views
4. **Regular cleanup**: Delete unused views

---

## 🚀 Future Enhancements

### Planned Features
- [ ] OR logic for filters
- [ ] Filter groups (AND/OR combinations)
- [ ] Saved filter presets
- [ ] Color rule priority reordering
- [ ] Custom color picker
- [ ] Cell-level conditional formatting
- [ ] Filter by related records
- [ ] Advanced date filters (relative dates)
- [ ] Bulk filter operations
- [ ] Filter templates

### API Integration
```typescript
// Future: Server-side filtering
const response = await fetch('/api/tables/[id]/rows', {
  method: 'POST',
  body: JSON.stringify({
    filters: currentView.filters,
    sorts: currentView.sorts,
    limit: 100,
    offset: 0
  })
})
```

---

## 📚 Code Examples

### Complete Filter Example

```typescript
// 1. Setup
const { addFilter, removeFilter } = useViewStore()
const currentView = getActiveView()

// 2. Add multiple filters
addFilter(currentView.id, {
  columnId: 'status',
  operator: 'not_equals',
  value: 'Completed'
})

addFilter(currentView.id, {
  columnId: 'priority',
  operator: 'equals',
  value: 'High'
})

addFilter(currentView.id, {
  columnId: 'budget',
  operator: 'gt',
  value: 50000
})

// 3. Apply filters
const filteredRows = applyFilters(
  currentTable.rows,
  currentView.filters
)

// 4. Render
{filteredRows.map(row => (
  <tr key={row.id}>
    {/* ... */}
  </tr>
))}
```

### Complete Color Rule Example

```typescript
// 1. Setup
const { addColorRule } = useViewStore()
const currentView = getActiveView()

// 2. Add color rules
addColorRule(currentView.id, {
  columnId: 'status',
  operator: 'equals',
  value: 'Completed',
  color: 'bg-green-100 dark:bg-green-900/30',
  textColor: 'text-green-900 dark:text-green-100'
})

addColorRule(currentView.id, {
  columnId: 'priority',
  operator: 'equals',
  value: 'High',
  color: 'bg-red-100 dark:bg-red-900/30',
  textColor: 'text-red-900 dark:text-red-100'
})

// 3. Apply colors
{filteredRows.map(row => {
  const { background, text } = getRowColorClasses(
    row,
    currentView.colorRules
  )
  
  return (
    <tr key={row.id} className={`${background} ${text}`}>
      {/* ... */}
    </tr>
  )
})}
```

---

**Version**: 0.4.0  
**Last Updated**: November 2024  
**Status**: Production Ready
