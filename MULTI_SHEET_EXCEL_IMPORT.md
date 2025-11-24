# Multi-Sheet Excel Import Feature

## ✅ Implemented Feature

ZeroStack now supports importing multiple sheets from a single Excel workbook! Each sheet can become a new sheet in your workspace.

---

## 🎯 How It Works

### **Automatic Sheet Detection**
When you upload an Excel file with multiple sheets:
1. **File is analyzed** - All sheet names are detected
2. **Sheet selector appears** - Checkboxes for each sheet
3. **You choose** - Select which sheets to import
4. **Each creates a new sheet** - In your current workspace

### **Single Sheet Files**
- If Excel file has only 1 sheet → imports directly (no selector)
- Behaves like the original single-sheet import

---

## 🚀 User Flow

### Step-by-Step Process

```
1. Click "Import" button
   ↓
2. Choose "Excel"
   ↓
3. Upload .xlsx file
   ↓
4. [If multiple sheets detected]
   → Sheet selector appears
   → Check sheets you want
   ↓
5. Click "Import Data"
   ↓
6. ✅ New sheets created in sidebar!
```

---

## 📊 Example Scenario

### Excel File: "Q4_Reports.xlsx"
**Contains 3 sheets:**
- Sales Data
- Marketing Metrics
- Customer Feedback

### After Import:
Your ZeroStack workspace sidebar shows:
- ✅ Sales Data (new sheet)
- ✅ Marketing Metrics (new sheet)
- ✅ Customer Feedback (new sheet)

Each with its own data, ready to work with!

---

## 🎨 UI Features

### Sheet Selector
- **Checkbox list** - One for each sheet in the Excel file
- **Sheet names** - Exactly as they appear in Excel
- **Counter** - Shows how many sheets selected
- **Scrollable** - Handles files with many sheets
- **Pre-selected** - First sheet selected by default

### Visual Feedback
```
┌─────────────────────────────────┐
│ Select Sheets to Import         │
├─────────────────────────────────┤
│ ☑ Sales Data                    │
│ ☑ Marketing Metrics             │
│ ☐ Customer Feedback             │
└─────────────────────────────────┘
2 sheet(s) selected. Each will 
create a new sheet in your workspace.
```

---

## 🔧 Technical Implementation

### Sheet Detection
```typescript
// When Excel file is selected
const data = await file.arrayBuffer()
const workbook = XLSX.read(data, { type: 'array' })
const sheetNames = workbook.SheetNames

// Show selector if multiple sheets
if (sheetNames.length > 1) {
  setShowSheetSelector(true)
}
```

### Multi-Sheet Parsing
```typescript
const parseExcel = async (file, sheetNames) => {
  const result = {}
  
  sheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    result[sheetName] = jsonData
  })
  
  return result // { "Sheet1": [...], "Sheet2": [...] }
}
```

### Sheet Creation
```typescript
// For each selected sheet
for (const [sheetName, rows] of Object.entries(sheetsData)) {
  await supabase
    .from('views')
    .insert({
      user_id: userId,
      table_id: datasetId,
      name: sheetName,      // Excel sheet name
      type: 'grid',
      rows: rows            // Sheet data
    })
}
```

---

## 💡 Key Benefits

### 1. **Preserve Structure**
- Excel workbook structure → ZeroStack workspace structure
- Sheet names maintained
- Data organization preserved

### 2. **Bulk Import**
- Import entire project in one go
- No need to split files manually
- Saves time and effort

### 3. **Selective Import**
- Choose only sheets you need
- Skip irrelevant sheets
- Keep workspace clean

### 4. **Template Support**
- Import pre-built Excel templates
- All sheets come in ready to use
- Perfect for project kickstarts

---

## 📋 Use Cases

### 1. **Project Templates**
Import a complete project template with:
- Tasks sheet
- Timeline sheet
- Resources sheet
- Budget sheet

### 2. **Department Reports**
Import quarterly reports with:
- Sales sheet
- Marketing sheet
- Operations sheet
- Finance sheet

### 3. **Data Migration**
Move from Excel to ZeroStack:
- All sheets at once
- Maintain organization
- Quick transition

### 4. **Client Deliverables**
Import client data packages:
- Contact list
- Project details
- Invoices
- Notes

---

## ⚙️ Configuration Options

### Default Behavior
- **First sheet pre-selected** - Ready to import immediately
- **All sheets available** - Can select/deselect any
- **No limit** - Import as many sheets as you want

### Sheet Naming
- **Uses Excel names** - Exactly as in the workbook
- **Collision handling** - Supabase handles duplicate names
- **Editable after import** - Rename sheets in ZeroStack

---

## 🎯 Best Practices

### Before Importing
1. **Review sheet names** - Ensure they're descriptive
2. **Check data quality** - Clean up Excel file first
3. **Remove empty sheets** - Don't import blank sheets
4. **Organize in Excel** - Structure carries over

### During Import
1. **Select relevant sheets** - Don't import everything blindly
2. **Check sheet count** - Verify selection before importing
3. **Wait for completion** - Don't navigate away
4. **Monitor progress** - Watch for errors

### After Importing
1. **Verify all sheets** - Check sidebar for new sheets
2. **Review data** - Ensure everything imported correctly
3. **Rename if needed** - Adjust sheet names in ZeroStack
4. **Set up views** - Configure filters, sorts, colors

---

## 🐛 Troubleshooting

### Sheet Selector Not Appearing?
- **Check sheet count** - File must have 2+ sheets
- **Verify file format** - Must be .xlsx or .xls
- **Try re-uploading** - File may not have loaded properly

### Some Sheets Missing?
- **Check selection** - Ensure checkboxes are checked
- **Look for errors** - Console may show issues
- **Verify sheet names** - Empty sheets may be skipped

### Import Takes Long Time?
- **Large file** - Many sheets or rows take longer
- **Be patient** - Don't refresh or navigate away
- **Check progress** - "Importing..." indicator shows activity

### Sheets Not in Sidebar?
- **Refresh page** - New sheets should appear
- **Check workspace** - Ensure you're in correct dataset
- **Verify import** - Look for success message

---

## 🔮 Future Enhancements

### Potential Features
1. **Sheet preview** - See data before importing
2. **Column mapping** - Map Excel columns to ZeroStack columns
3. **Data validation** - Check data quality before import
4. **Import history** - Track what was imported when
5. **Batch operations** - Import from multiple Excel files
6. **Sheet merging** - Combine similar sheets
7. **Selective columns** - Choose which columns to import
8. **Data transformation** - Clean/transform during import

---

## 📚 Comparison

### Single-Sheet Import
```
Excel File (1 sheet)
    ↓
Import
    ↓
Appends to current sheet
```

### Multi-Sheet Import
```
Excel File (3 sheets)
    ↓
Select sheets
    ↓
Import
    ↓
Creates 3 new sheets
```

---

## 💡 Tips & Tricks

### Tip 1: Organize Before Import
Structure your Excel file with clear sheet names before importing. This makes your ZeroStack workspace instantly organized.

### Tip 2: Use Templates
Create Excel templates with pre-configured sheets. Import them to quickly start new projects.

### Tip 3: Selective Import
Don't feel obligated to import all sheets. Choose only what you need to keep your workspace clean.

### Tip 4: Batch Processing
Have multiple Excel files? Import them one by one, selecting relevant sheets from each.

### Tip 5: Sheet Naming
Use descriptive sheet names in Excel. They become your ZeroStack sheet names, so make them meaningful!

---

## 🎓 Example Workflows

### Workflow 1: Project Import
```
1. Prepare Excel with sheets:
   - Tasks
   - Timeline  
   - Team
   - Budget

2. Upload to ZeroStack

3. Select all 4 sheets

4. Import

5. Result: Complete project workspace!
```

### Workflow 2: Selective Import
```
1. Excel has 10 sheets

2. Upload to ZeroStack

3. Select only 3 relevant sheets

4. Import

5. Result: Clean, focused workspace
```

### Workflow 3: Template Deployment
```
1. Create Excel template

2. Share with team

3. Each person imports to ZeroStack

4. Everyone has same structure

5. Result: Standardized workspaces
```

---

## 📊 Technical Specifications

### Supported Formats
- ✅ .xlsx (Excel 2007+)
- ✅ .xls (Excel 97-2003)
- ✅ LibreOffice Calc
- ✅ Google Sheets exports

### Limitations
- **Sheet limit**: No hard limit, but browser memory applies
- **File size**: Recommend < 10 MB for best performance
- **Sheet names**: Must be valid (no special characters that break DB)
- **Data types**: Text, numbers, dates (formulas converted to values)

### Performance
- **Small files** (< 1 MB): Instant
- **Medium files** (1-5 MB): Few seconds
- **Large files** (5-10 MB): 10-30 seconds
- **Very large files** (> 10 MB): May be slow or fail

---

## 🎯 Quick Reference

### Multi-Sheet Import Checklist
```
☐ Excel file has multiple sheets
☐ Sheet names are descriptive
☐ Data is clean and formatted
☐ Empty sheets removed
☐ File size < 10 MB
☐ Ready to import!
```

### Import Process
```
1. Click "Import"
2. Choose "Excel"
3. Upload file
4. [If multiple sheets] Select sheets
5. Click "Import Data"
6. Wait for completion
7. Check sidebar for new sheets
```

---

**Last Updated**: November 14, 2025
**Version**: 1.2.0
**Status**: ✅ Implemented
