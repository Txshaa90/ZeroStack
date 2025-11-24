# Cell & Column Coloring Guide

## ✅ Complete Coloring System

ZeroStack now supports **three levels of coloring**:

### 1. **Rule-Based Row Coloring** 🎨
Color entire rows based on column values.

### 2. **Manual Row Coloring** 🖌️
Color entire rows manually.

### 3. **Individual Cell/Column Coloring** ✨ NEW!
Color specific cells independently.

---

## 🎯 Cell Coloring Feature

### How to Color Individual Cells

1. **Hover over any cell** in the data grid
2. **Click the palette icon** (🎨) that appears on hover
3. **Choose a color**:
   - Use the color picker for custom colors
   - Click preset swatches for quick selection
   - Click "Clear" to remove the color

### Features

- **Hover-to-reveal**: Color picker only shows when you hover over a cell
- **Non-intrusive**: Doesn't clutter the UI
- **8 preset colors**: Quick access to common colors
- **Custom colors**: Full color picker for any color
- **Clear button**: Easy removal of cell colors
- **Instant feedback**: Colors apply immediately
- **Supabase persistence**: Colors are saved automatically

### Use Cases

**Highlight Important Data**
- Flag critical values in red
- Highlight milestones in green
- Mark warnings in yellow

**Visual Organization**
- Color-code categories within a column
- Highlight exceptions or outliers
- Create visual patterns for quick scanning

**Data Analysis**
- Mark reviewed items
- Flag items needing attention
- Create heat maps manually

---

## 🎨 Complete Color Priority System

Colors are applied in this order (highest to lowest):

1. **Cell Color** (highest priority) - Individual cell colors
2. **Row Manual Color** - Manual row coloring
3. **Row Rule Color** - Rule-based row coloring
4. **Transparent** - Default

This means:
- Cell colors override everything
- Row colors apply to cells without specific colors
- Rules apply when no manual colors are set

---

## 💡 Example Workflows

### Workflow 1: Project Status Tracking

**Setup:**
1. **Rule**: Status = "Completed" → Green rows
2. **Rule**: Status = "Blocked" → Red rows
3. **Manual Row**: VIP project → Gold row
4. **Cell Color**: Deadline cell → Red (if urgent)

**Result:**
- Most rows colored by status
- VIP project stands out in gold
- Urgent deadlines highlighted in red cells

### Workflow 2: Sales Pipeline

**Setup:**
1. **Rule**: Stage = "Closed Won" → Green rows
2. **Cell Color**: Deal value cells → Color by size
   - Large deals → Green
   - Medium deals → Yellow
   - Small deals → Gray

**Result:**
- Rows show overall status
- Individual cells show deal importance

### Workflow 3: Task Management

**Setup:**
1. **Rule**: Priority = "High" → Red rows
2. **Cell Color**: Assignee cells → Color by team
   - Engineering → Blue
   - Design → Purple
   - Marketing → Orange

**Result:**
- Rows show priority
- Cells show team ownership

---

## 🔄 Data Storage

### Cell Colors Structure

Stored in `views.rows` as part of each row:

```json
{
  "id": "row-123",
  "name": "Task 1",
  "status": "In Progress",
  "cellColors": {
    "name": "#fef08a",
    "status": "#bbf7d0",
    "assignee": "#bfdbfe"
  }
}
```

### Complete Row Structure

```json
{
  "id": "row-123",
  "name": "Task 1",
  "status": "In Progress",
  "manualColor": "#fed7aa",      // Row color (manual)
  "cellColors": {                 // Cell colors (per column)
    "name": "#fef08a",
    "status": "#bbf7d0"
  }
}
```

---

## 🎨 Available Preset Colors

### Preset Swatches (Same for all color pickers)

1. **Red** - `#fecaca` - Urgent, blocked, critical
2. **Orange** - `#fed7aa` - Warning, attention needed
3. **Yellow** - `#fef08a` - In progress, pending
4. **Green** - `#bbf7d0` - Completed, success, good
5. **Blue** - `#bfdbfe` - Information, active, primary
6. **Purple** - `#ddd6fe` - Special, featured
7. **Pink** - `#fbcfe8` - Highlight, important
8. **Gray** - `#e5e7eb` - Neutral, inactive

---

## 🚀 Tips & Best Practices

### When to Use Cell Colors

✅ **Good Use Cases:**
- Highlighting specific important values
- Color-coding categories within a column
- Marking exceptions or outliers
- Creating visual patterns for analysis

❌ **Avoid:**
- Coloring every cell (reduces impact)
- Using too many different colors
- Coloring for decoration only

### Color Combinations

**For Data Analysis:**
- Use green for positive/good values
- Use red for negative/bad values
- Use yellow for neutral/warning values

**For Categories:**
- Assign consistent colors to categories
- Use distinct, easily distinguishable colors
- Limit to 5-7 categories max

**For Status:**
- Green = Complete/Success
- Yellow = In Progress/Warning
- Red = Blocked/Error
- Blue = Active/Current
- Gray = Inactive/Archived

---

## 🎯 UI Behavior

### Cell Hover Effect

```
Normal State:
┌─────────────────┐
│ Cell Value      │
└─────────────────┘

Hover State:
┌─────────────────┐
│ Cell Value  🎨  │  ← Palette icon appears
└─────────────────┘
```

### Color Picker Popover

```
┌──────────────────────┐
│ Cell Color           │
│ ┌────┐ ┌──────────┐ │
│ │ 🎨 │ │  Clear   │ │
│ └────┘ └──────────┘ │
│                      │
│ Preset Colors:       │
│ ⬜⬜⬜⬜⬜          │
│ ⬜⬜⬜              │
└──────────────────────┘
```

---

## 💾 Performance

- **Minimal Impact**: Cell colors are stored efficiently
- **Fast Rendering**: Colors applied via inline styles
- **Optimized Updates**: Only changed cells are updated
- **Supabase Sync**: Async updates don't block UI

---

## 🐛 Troubleshooting

**Color picker not appearing?**
- Make sure you're hovering over the cell
- Check if the table is in edit mode
- Try refreshing the page

**Colors not saving?**
- Check Supabase connection
- Verify RLS policies
- Look for errors in console

**Colors look different?**
- Check browser color profile
- Verify dark mode settings
- Ensure consistent color values

**Cell color not showing?**
- Cell colors have highest priority
- Check if row color is overriding (it shouldn't)
- Verify the color value is valid

---

## 🔐 Security & Validation

- Colors are sanitized before storage
- Only hex color values are accepted
- User-specific (RLS protected)
- No CSS injection possible

---

**Last Updated**: November 14, 2025
**Version**: 3.0.0
