'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Database,
  Plus,
  MoreVertical,
  Settings,
  Trash2,
  Search,
  ChevronDown,
  Grid3x3,
  LayoutGrid,
  FileText,
  Columns,
  Filter as FilterIcon,
  ArrowUpDown,
  Palette,
  Eye,
  Share2,
  Menu,
  Home,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useTableStore, ColumnType } from '@/store/useTableStore'
import { useViewStore, ViewType } from '@/store/useViewStore'
import { ThemeToggle } from '@/components/theme-toggle'
import { FilterBuilder } from '@/components/filter-builder'
import { ColorRuleBuilder } from '@/components/color-rule-builder'
import { OverviewPage } from '@/components/overview-page'
import { applyFilters, getRowColorClasses } from '@/lib/filter-utils'

export default function NocoDBWorkspaceAdvanced() {
  const [mounted, setMounted] = useState(false)
  const [showOverview, setShowOverview] = useState(true)
  
  const {
    tables,
    activeTableId,
    setActiveTable,
    addTable,
    addColumn,
    addRow,
    updateCell,
    deleteRow,
    getActiveTable,
  } = useTableStore()

  const {
    views,
    activeViewId,
    setActiveView,
    addView,
    getViewsByTable,
    getActiveView,
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    addSort,
    removeSort,
    toggleColumnVisibility,
    addColorRule,
    removeColorRule,
    clearColorRules,
  } = useViewStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [newTableName, setNewTableName] = useState('')
  const [newViewName, setNewViewName] = useState('')
  const [newViewType, setNewViewType] = useState<ViewType>('grid')
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterBuilder, setShowFilterBuilder] = useState(false)
  const [showColorBuilder, setShowColorBuilder] = useState(false)

  const currentTable = getActiveTable()
  const currentView = getActiveView()
  const tableViews = currentTable ? getViewsByTable(currentTable.id) : []

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize default view for tables without views
  useEffect(() => {
    if (mounted && currentTable && tableViews.length === 0) {
      const allColumnIds = currentTable.columns.map(c => c.id)
      addView(currentTable.id, 'Default View', 'grid', allColumnIds)
    }
  }, [mounted, currentTable?.id])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-16 w-16 mx-auto mb-4 opacity-20 animate-pulse" />
          <p className="text-gray-500">Loading workspace...</p>
        </div>
      </div>
    )
  }

  const handleAddTable = () => {
    if (!newTableName.trim()) return
    addTable(newTableName)
    setNewTableName('')
  }

  const handleAddView = () => {
    if (!newViewName.trim() || !currentTable) return
    const allColumnIds = currentTable.columns.map(c => c.id)
    addView(currentTable.id, newViewName, newViewType, allColumnIds)
    setNewViewName('')
  }

  const handleAddColumn = () => {
    if (!newColumnName.trim() || !currentTable) return
    addColumn(currentTable.id, {
      name: newColumnName,
      type: newColumnType,
      width: 200,
    })
    setNewColumnName('')
  }

  // Apply filters, search, and sorts
  const getFilteredAndSortedRows = () => {
    if (!currentTable || !currentView) return []
    
    let rows = [...currentTable.rows]

    // Apply search
    if (searchQuery) {
      rows = rows.filter((row) =>
        currentTable.columns.some((col) => {
          const value = String(row[col.id] || '').toLowerCase()
          return value.includes(searchQuery.toLowerCase())
        })
      )
    }

    // Apply view filters
    rows = applyFilters(rows, currentView.filters)

    // Apply sorts
    if (currentView.sorts.length > 0) {
      rows.sort((a, b) => {
        for (const sort of currentView.sorts) {
          const aVal = String(a[sort.field] || '')
          const bVal = String(b[sort.field] || '')
          const comparison = aVal.localeCompare(bVal, undefined, { numeric: true })
          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison
          }
        }
        return 0
      })
    }

    return rows
  }

  const filteredRows = getFilteredAndSortedRows()
  const visibleColumns = currentTable?.columns.filter(
    (col) => currentView?.visibleColumns.includes(col.id)
  ) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 h-14 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-9"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">ZeroStack</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 h-9"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'w-0' : 'w-64'
          }`}
        >
          {!sidebarCollapsed && (
            <>
              {/* Getting Started Section */}
              <div className="p-4 border-b dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Getting Started
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full" data-create-table>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Table</DialogTitle>
                      <DialogDescription>
                        Add a new table to your workspace
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        placeholder="Table name"
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                      />
                      <Button onClick={handleAddTable} className="w-full">
                        Create Table
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Navigation */}
              <div className="p-2 border-b dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${showOverview && !activeTableId ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => {
                    setShowOverview(true)
                    setActiveTable('')
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Overview
                </Button>
              </div>

              {/* Data Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Data
                    </span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  </div>

                  {/* Tables List */}
                  <div className="space-y-0.5">
                    {tables.map((table) => (
                      <div key={table.id}>
                        <div
                          className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer group ${
                            activeTableId === table.id
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            setShowOverview(false)
                            setActiveTable(table.id)
                            const views = getViewsByTable(table.id)
                            if (views.length > 0) {
                              setActiveView(views[0].id)
                            }
                          }}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Grid3x3 className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate">{table.name}</span>
                          </div>
                          <MoreVertical className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                        </div>

                        {/* Views for active table */}
                        {activeTableId === table.id && tableViews.length > 0 && (
                          <div className="ml-6 mt-1 space-y-0.5">
                            {tableViews.map((view) => (
                              <div
                                key={view.id}
                                className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer text-sm ${
                                  activeViewId === view.id
                                    ? 'bg-primary/5 text-primary'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                                onClick={() => setActiveView(view.id)}
                              >
                                {view.type === 'grid' && <Grid3x3 className="h-3 w-3" />}
                                {view.type === 'gallery' && <LayoutGrid className="h-3 w-3" />}
                                {view.type === 'form' && <FileText className="h-3 w-3" />}
                                {view.type === 'kanban' && <Columns className="h-3 w-3" />}
                                <span className="truncate">{view.name}</span>
                              </div>
                            ))}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-7 text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Create View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Create New View</DialogTitle>
                                  <DialogDescription>
                                    Add a new view to {table.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Input
                                    placeholder="View name"
                                    value={newViewName}
                                    onChange={(e) => setNewViewName(e.target.value)}
                                  />
                                  <Select value={newViewType} onValueChange={(v) => setNewViewType(v as ViewType)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="grid">Grid View</SelectItem>
                                      <SelectItem value="gallery">Gallery View</SelectItem>
                                      <SelectItem value="form">Form View</SelectItem>
                                      <SelectItem value="kanban">Kanban View</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button onClick={handleAddView} className="w-full">
                                    Create View
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          {showOverview ? (
            <OverviewPage
              onCreateTable={() => {
                // Open create table dialog
                const createButton = document.querySelector('[data-create-table]') as HTMLElement
                createButton?.click()
              }}
              onImportData={() => {
                // Navigate to dashboard to use real datasets with import
                window.location.href = '/dashboard'
              }}
            />
          ) : currentTable && currentView ? (
            <>
              {/* View Toolbar */}
              <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* View Selector */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          {currentView.type === 'grid' && <Grid3x3 className="h-4 w-4 mr-2" />}
                          {currentView.type === 'gallery' && <LayoutGrid className="h-4 w-4 mr-2" />}
                          {currentView.type === 'form' && <FileText className="h-4 w-4 mr-2" />}
                          {currentView.type === 'kanban' && <Columns className="h-4 w-4 mr-2" />}
                          {currentView.name}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {tableViews.map((view) => (
                          <DropdownMenuItem
                            key={view.id}
                            onClick={() => setActiveView(view.id)}
                          >
                            {view.type === 'grid' && <Grid3x3 className="h-4 w-4 mr-2" />}
                            {view.type === 'gallery' && <LayoutGrid className="h-4 w-4 mr-2" />}
                            {view.type === 'form' && <FileText className="h-4 w-4 mr-2" />}
                            {view.type === 'kanban' && <Columns className="h-4 w-4 mr-2" />}
                            {view.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                    {/* Fields */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-2" />
                          Fields
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {currentTable.columns.map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={currentView.visibleColumns.includes(column.id)}
                            onCheckedChange={() => toggleColumnVisibility(currentView.id, column.id)}
                          >
                            {column.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Filter */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setShowFilterBuilder(true)}
                    >
                      <FilterIcon className="h-4 w-4 mr-2" />
                      Filter
                      {currentView.filters.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          {currentView.filters.length}
                        </span>
                      )}
                    </Button>

                    {/* Sort */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          Sort
                          {currentView.sorts.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                              {currentView.sorts.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {currentTable.columns.map((column) => (
                          <DropdownMenuItem
                            key={column.id}
                            onClick={() => {
                              const existingSort = currentView.sorts.find(s => s.field === column.id)
                              if (existingSort) {
                                addSort(currentView.id, column.id, existingSort.direction === 'asc' ? 'desc' : 'asc')
                              } else {
                                addSort(currentView.id, column.id, 'asc')
                              }
                            }}
                          >
                            {column.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Color */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => setShowColorBuilder(true)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Colour
                      {currentView.colorRules.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          {currentView.colorRules.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {filteredRows.length} records
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid View Content */}
              {currentView.type === 'grid' && (
                <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 z-10">
                      <tr>
                        <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                          #
                        </th>
                        {visibleColumns.map((column) => (
                          <th
                            key={column.id}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-l dark:border-gray-600 min-w-[200px]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{column.name}</span>
                                <span className="text-xs text-gray-400">({column.type})</span>
                              </div>
                            </div>
                          </th>
                        ))}
                        <th className="w-12 px-4 py-3 border-b border-l dark:border-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((row, rowIndex) => {
                        const { background, text } = getRowColorClasses(row, currentView.colorRules)
                        return (
                          <tr
                            key={row.id}
                            className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${background} ${text}`}
                          >
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {rowIndex + 1}
                            </td>
                            {visibleColumns.map((column) => (
                              <td key={column.id} className="px-4 py-2 border-l dark:border-gray-700">
                                <Input
                                  value={row[column.id] || ''}
                                  onChange={(e) => updateCell(currentTable.id, row.id, column.id, e.target.value)}
                                  className="border-0 focus-visible:ring-1 focus-visible:ring-primary h-8 px-2 bg-transparent"
                                  placeholder={`Enter ${column.name.toLowerCase()}`}
                                  type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-2 border-l dark:border-gray-700">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => deleteRow(currentTable.id, row.id)}
                              >
                                <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                      <tr className="border-b dark:border-gray-700">
                        <td colSpan={visibleColumns.length + 2} className="px-4 py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-gray-500"
                            onClick={() => addRow(currentTable.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New record
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {filteredRows.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Grid3x3 className="h-16 w-16 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm mt-1">
                        {searchQuery || currentView.filters.length > 0
                          ? 'Try adjusting your filters'
                          : 'Click "New record" to add data'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Other View Types */}
              {currentView.type !== 'grid' && (
                <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
                  <div className="text-center text-gray-400">
                    {currentView.type === 'gallery' && <LayoutGrid className="h-16 w-16 mx-auto mb-4 opacity-20" />}
                    {currentView.type === 'form' && <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />}
                    {currentView.type === 'kanban' && <Columns className="h-16 w-16 mx-auto mb-4 opacity-20" />}
                    <p className="text-lg font-medium capitalize">{currentView.type} View</p>
                    <p className="text-sm mt-1">Coming soon...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Database className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No table selected</p>
                <p className="text-sm mt-1">Create or select a table to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Filter Builder Modal */}
      {currentTable && currentView && (
        <FilterBuilder
          open={showFilterBuilder}
          onOpenChange={setShowFilterBuilder}
          columns={currentTable.columns}
          filters={currentView.filters}
          onAddFilter={(filter) => addFilter(currentView.id, filter)}
          onUpdateFilter={(id, updates) => updateFilter(currentView.id, id, updates)}
          onRemoveFilter={(id) => removeFilter(currentView.id, id)}
          onClearFilters={() => clearFilters(currentView.id)}
        />
      )}

      {/* Color Rule Builder Modal */}
      {currentTable && currentView && (
        <ColorRuleBuilder
          open={showColorBuilder}
          onOpenChange={setShowColorBuilder}
          columns={currentTable.columns}
          colorRules={currentView.colorRules}
          onAddColorRule={(rule) => addColorRule(currentView.id, rule)}
          onRemoveColorRule={(id) => removeColorRule(currentView.id, id)}
          onClearColorRules={() => clearColorRules(currentView.id)}
        />
      )}
    </div>
  )
}
