# Import Data Feature Guide

## ✅ Implemented Feature

ZeroStack now supports importing data from external sources, similar to NocoDB!

## 🎯 Supported Import Formats

### 1. **CSV (Comma-Separated Values)** 📊
- Standard CSV files with headers
- Automatic column mapping
- Supports quoted values
- Common export format from Excel, Google Sheets, etc.

### 2. **Excel (.xlsx, .xls)** 📗
- Microsoft Excel files
- Automatic header detection
- First sheet only
- Direct import without conversion

### 3. **JSON (JavaScript Object Notation)** 📄
- Array of objects format
- Single object format
- Automatic ID generation
- Common API export format

---

## 🚀 How to Import Data

### Step 1: Open Import Dialog
1. Navigate to your dataset workspace
2. Click the **"Import"** button (next to "Add Row")
3. Import dialog opens

### Step 2: Choose Import Source
Select your data source:
- **CSV** - For spreadsheet data
- **Excel** - For Microsoft Excel files (.xlsx, .xls)
- **JSON** - For structured data/API exports

### Step 3: Upload File
1. Click "Choose File" or drag & drop
2. Select your CSV or JSON file
3. File name and size will be displayed

### Step 4: Import
1. Review the file information
2. Click **"Import Data"** button
3. Wait for import to complete
4. Data appears in your sheet!

---

## 📋 CSV Import Format

### Example CSV File
```csv
name,email,status,priority
John Doe,john@example.com,Active,High
Jane Smith,jane@example.com,Pending,Medium
Bob Johnson,bob@example.com,Active,Low
```

### Requirements
- **First row must be headers** - Column names
- **Comma-separated values** - Standard CSV format
- **Quoted values supported** - For values with commas
- **UTF-8 encoding** - For special characters

### What Happens
1. Headers become column identifiers
2. Each row becomes a new row in your sheet
3. Unique IDs are auto-generated
4. Data is appended to existing rows

---

## 📗 Excel Import Format

### Example Excel File
| name       | email              | status  | priority |
|------------|-------------------|---------|----------|
| John Doe   | john@example.com  | Active  | High     |
| Jane Smith | jane@example.com  | Pending | Medium   |
| Bob Johnson| bob@example.com   | Active  | Low      |

### Requirements
- **First row must be headers** - Column names
- **Excel format** - .xlsx or .xls files
- **First sheet only** - Only the first sheet is imported
- **UTF-8 compatible** - For special characters

### What Happens
1. Headers from first row become column identifiers
2. Each row becomes a new row in your sheet
3. Unique IDs are auto-generated
4. Data is appended to existing rows
5. Formulas are converted to values
6. Formatting is not preserved

---

## 📄 JSON Import Format

### Array of Objects (Recommended)
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "status": "Active",
    "priority": "High"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "Pending",
    "priority": "Medium"
  }
]
```

### Single Object
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "status": "Active",
  "priority": "High"
}
```

### Requirements
- **Valid JSON syntax** - Must be parseable
- **Object keys** - Become column identifiers
- **UTF-8 encoding** - For special characters

### What Happens
1. Object keys become column identifiers
2. Each object becomes a new row
3. Unique IDs are auto-generated if not present
4. Data is appended to existing rows

---

## 💡 Import Behavior

### Data Appending
- **Imported data is APPENDED** to existing rows
- **Does not replace** existing data
- **Does not delete** existing rows
- **Preserves** all current data

### Column Matching
- **Automatic matching** by column name/key
- **New columns** are NOT created automatically
- **Unmapped data** is stored but may not display
- **Existing columns** are populated with matching data

### ID Generation
- **Automatic UUID generation** for each row
- **Preserves existing IDs** if present in JSON
- **Unique IDs** guaranteed for all rows

---

## 🎨 Use Cases

### 1. **Migrate from Spreadsheets**
- Export from Excel/Google Sheets as CSV
- Import into ZeroStack
- Continue working with enhanced features

### 2. **Import API Data**
- Export data from APIs as JSON
- Import into ZeroStack
- Visualize and analyze

### 3. **Bulk Data Entry**
- Prepare data in spreadsheet
- Export as CSV
- Import for quick bulk entry

### 4. **Data Integration**
- Export from other tools
- Import into ZeroStack
- Centralize your data

### 5. **Backup Restoration**
- Export data as JSON backup
- Import to restore data
- Maintain data continuity

---

## 📊 Example Workflows

### Workflow 1: Excel to ZeroStack (Direct)
```
1. Open ZeroStack workspace
2. Click "Import" button
3. Choose "Excel"
4. Upload .xlsx file
5. Click "Import Data"
6. ✅ Data imported!
```

### Workflow 2: Excel to ZeroStack (via CSV)
```
1. Open Excel spreadsheet
2. File → Save As → CSV
3. Open ZeroStack workspace
4. Click "Import" button
5. Choose "CSV"
6. Upload CSV file
7. Click "Import Data"
8. ✅ Data imported!
```

### Workflow 3: API to ZeroStack
```
1. Call API endpoint
2. Save response as JSON file
3. Open ZeroStack workspace
4. Click "Import" button
5. Choose "JSON"
6. Upload JSON file
7. Click "Import Data"
8. ✅ Data imported!
```

### Workflow 4: Google Sheets to ZeroStack
```
1. Open Google Sheets
2. File → Download → CSV
3. Open ZeroStack workspace
4. Click "Import" button
5. Choose "CSV"
6. Upload CSV file
7. Click "Import Data"
8. ✅ Data imported!
```

---

## 🔧 Technical Details

### CSV Parsing
```typescript
// Headers from first row
const headers = lines[0].split(',')

// Parse each subsequent row
rows.forEach(line => {
  const values = line.split(',')
  const row = {}
  headers.forEach((header, index) => {
    row[header] = values[index]
  })
})
```

### JSON Parsing
```typescript
// Parse JSON
const data = JSON.parse(text)

// Handle array or single object
if (Array.isArray(data)) {
  return data.map(item => ({
    id: item.id || crypto.randomUUID(),
    ...item
  }))
}
```

### Data Storage
```typescript
// Get current rows
const currentRows = sheet.rows || []

// Append imported rows
const updatedRows = [...currentRows, ...importedRows]

// Update Supabase
await supabase
  .from('views')
  .update({ rows: updatedRows })
  .eq('id', sheetId)
```

---

## ⚠️ Important Notes

### File Size Limits
- **Recommended**: < 5 MB
- **Maximum**: Depends on browser memory
- **Large files**: May take longer to process

### Data Validation
- **No automatic validation** - Data is imported as-is
- **Manual review** recommended after import
- **Data types** are not enforced during import

### Column Creation
- **Columns are NOT auto-created** from import
- **Pre-create columns** before importing
- **Unmapped data** is stored but may not display

### Encoding
- **UTF-8 recommended** for all files
- **Special characters** may cause issues with other encodings
- **Test with small file** first

---

## 🐛 Troubleshooting

### Import Button Not Working?
- Check if you're in a workspace
- Ensure you have a sheet selected
- Try refreshing the page

### File Not Uploading?
- Check file format (CSV, Excel, or JSON)
- Verify file is not corrupted
- Try a smaller file first
- For Excel: Ensure .xlsx or .xls format

### Data Not Appearing?
- Check if columns match your data
- Verify file format is correct
- Look for errors in console

### Import Failed Error?
- **CSV**: Check for malformed rows
- **Excel**: Ensure first row has headers, check for merged cells
- **JSON**: Validate JSON syntax
- **All**: Check file encoding

### Partial Import?
- Some rows may have failed
- Check console for errors
- Review imported data
- Re-import failed rows

---

## 🔮 Future Enhancements

### Planned Features
1. ~~**Excel (.xlsx) Support**~~ - ✅ **Implemented!**
2. **Airtable Import** - Import from Airtable bases
3. **Google Sheets Integration** - Direct import from Sheets
4. **Column Mapping UI** - Visual column mapping
5. **Data Preview** - Preview before import
6. **Validation Rules** - Validate data during import
7. **Duplicate Detection** - Detect and handle duplicates
8. **Import History** - Track all imports
9. **Scheduled Imports** - Automatic recurring imports
10. **API Import** - Import directly from APIs

### Not Planned
- **Database imports** - Use export to CSV/JSON first
- **Binary file imports** - Not supported
- **Image imports** - Use file upload fields instead

---

## 📚 Related Features

### Export Data
- Export your data as CSV or JSON
- Create backups
- Share data with others
- *(Coming soon)*

### Data Sync
- Sync with external sources
- Keep data up-to-date
- Two-way synchronization
- *(Coming soon)*

### API Access
- Import via REST API
- Programmatic data import
- Automation support
- *(Coming soon)*

---

## 💡 Tips & Best Practices

### Before Importing
1. **Create columns first** - Match your data structure
2. **Test with small file** - Verify format works
3. **Backup existing data** - Export before importing
4. **Clean your data** - Remove duplicates, fix formatting

### During Import
1. **Check file size** - Keep under 5 MB
2. **Verify format** - CSV, Excel, or JSON
3. **Monitor progress** - Watch for errors
4. **Don't navigate away** - Wait for completion

### After Importing
1. **Review data** - Check all rows imported
2. **Verify columns** - Ensure data mapped correctly
3. **Test features** - Filters, sorts, colors still work
4. **Save/backup** - Data is auto-saved to Supabase

---

## 🎯 Quick Reference

### CSV Import
```
✅ Headers in first row
✅ Comma-separated values
✅ Quoted values supported
✅ UTF-8 encoding
❌ No column auto-creation
```

### Excel Import
```
✅ .xlsx and .xls files
✅ Headers in first row
✅ First sheet only
✅ Formulas converted to values
❌ No column auto-creation
```

### JSON Import
```
✅ Array of objects
✅ Single object
✅ Valid JSON syntax
✅ UTF-8 encoding
❌ No column auto-creation
```

### Import Process
```
1. Click "Import" button
2. Choose format (CSV/Excel/JSON)
3. Upload file
4. Click "Import Data"
5. Wait for completion
6. Review imported data
```

---

**Last Updated**: November 14, 2025
**Version**: 1.1.0
**Status**: ✅ Implemented (CSV, Excel, JSON)
