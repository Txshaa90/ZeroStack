'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/navbar'
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
  Search,
  Settings,
  FolderPlus,
  Grid3x3,
  ChevronRight,
  ChevronDown,
  Folder,
  LayoutGrid,
  List,
} from 'lucide-react'
import Link from 'next/link'
import { useTableStore } from '@/store/useTableStore'
import { useViewStore } from '@/store/useViewStore'
import { ThemeToggle } from '@/components/theme-toggle'
import { FolderCard } from '@/components/folder-card'
import { DatasetCard } from '@/components/dataset-card'
import { supabase } from '@/lib/supabase'

type SupabaseFolder = {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

type SupabaseTable = {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  columns: any[]
  rows: any[]
  created_at: string
  updated_at: string
}

const FOLDER_COLORS = [
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
]

export default function Dashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0].value)
  const [newTableName, setNewTableName] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renamingItem, setRenamingItem] = useState<{ type: 'folder' | 'table'; id: string; name: string } | null>(null)
  const [moveToFolderDialog, setMoveToFolderDialog] = useState(false)
  const [movingTableId, setMovingTableId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Supabase data
  const [supabaseFolders, setSupabaseFolders] = useState<SupabaseFolder[]>([])
  const [supabaseTables, setSupabaseTables] = useState<SupabaseTable[]>([])
  const [loading, setLoading] = useState(true)

  const {
    tables,
    folders,
    addTable,
    deleteTable,
    updateTable,
    addFolder,
    deleteFolder,
    updateFolder,
    getFolderTables,
    moveTableToFolder,
  } = useTableStore()

  const { views } = useViewStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      // Use the seeded user ID
      const userId = '0aebc03e-defa-465d-ac65-b6c15806fd26'

      try {
        // Fetch folders
        const { data: foldersData, error: foldersError } = await supabase
          .from('folders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (foldersError) throw foldersError

        // Fetch tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (tablesError) throw tablesError

        setSupabaseFolders(foldersData || [])
        setSupabaseTables(tablesData || [])
        
        // Auto-expand all folders
        if (foldersData && foldersData.length > 0) {
          const allFolderIds = new Set(foldersData.map((f: SupabaseFolder) => f.id))
          setExpandedFolders(allFolderIds)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchData()
    }
  }, [mounted])

  useEffect(() => {
    // Auto-expand all folders when folders are loaded (for local store)
    if (mounted && folders.length > 0) {
      const allFolderIds = new Set(folders.map(f => f.id))
      setExpandedFolders(allFolderIds)
    }
  }, [mounted, folders])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Database className="h-16 w-16 opacity-20 animate-pulse" />
      </div>
    )
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    const userId = '0aebc03e-defa-465d-ac65-b6c15806fd26' // TODO: Get from auth context
    
    try {
      // Create in Supabase
      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: userId,
          name: newFolderName,
          color: newFolderColor
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Update local state
      setSupabaseFolders([data, ...supabaseFolders])
      
      setNewFolderName('')
      setNewFolderColor(FOLDER_COLORS[0].value)
      setShowFolderDialog(false)
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('Failed to create folder')
    }
  }

  const handleCreateTable = async () => {
    if (!newTableName.trim()) return
    
    const userId = '0aebc03e-defa-465d-ac65-b6c15806fd26' // TODO: Get from auth context
    
    try {
      // Create in Supabase
      const { data, error } = await supabase
        .from('tables')
        .insert({
          user_id: userId,
          folder_id: selectedFolderId,
          name: newTableName,
          columns: [],
          rows: []
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Update local state
      setSupabaseTables([...supabaseTables, data])
      
      // Create default views for the new table (Grid View and Chart View)
      const defaultViews = [
        {
          user_id: userId,
          table_id: data.id,
          name: 'Grid View',
          type: 'grid',
          visible_columns: [],
          filters: [],
          sorts: [],
          color_rules: [],
          group_by: null,
          rows: []
        },
        {
          user_id: userId,
          table_id: data.id,
          name: 'Chart View',
          type: 'chart',
          visible_columns: [],
          filters: [],
          sorts: [],
          color_rules: [],
          group_by: null,
          rows: [],
          chart_config: {
            chartType: 'bar',
            xAxisField: '',
            yAxisField: '',
            aggregation: 'count'
          }
        }
      ]
      
      const { error: viewError } = await supabase
        .from('views')
        .insert(defaultViews as any)
      
      if (viewError) console.error('Error creating default views:', viewError)
      
      setNewTableName('')
      setSelectedFolderId(null)
      setShowTableDialog(false)
    } catch (error) {
      console.error('Error creating dataset:', error)
      alert('Failed to create dataset')
    }
  }

  const handleRename = () => {
    if (!renamingItem) return
    if (renamingItem.type === 'folder') {
      updateFolder(renamingItem.id, { name: renamingItem.name })
    } else {
      updateTable(renamingItem.id, { name: renamingItem.name })
    }
    setRenameDialogOpen(false)
    setRenamingItem(null)
  }

  const handleMoveToFolder = () => {
    if (!movingTableId || selectedFolderId === undefined) return
    moveTableToFolder(movingTableId, selectedFolderId)
    setMoveToFolderDialog(false)
    setMovingTableId(null)
    setSelectedFolderId(null)
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  // Supabase-aware delete handlers
  const handleDeleteFolder = async (folderId: string) => {
    if (supabaseFolders.length > 0) {
      // Delete from Supabase
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
      
      if (error) {
        console.error('Error deleting folder:', error)
        alert('Failed to delete folder')
        return
      }
      
      // Update local state
      setSupabaseFolders(supabaseFolders.filter(f => f.id !== folderId))
    } else {
      // Use local store
      deleteFolder(folderId)
    }
  }

  const handleDeleteTable = async (tableId: string) => {
    if (supabaseTables.length > 0) {
      // Delete from Supabase
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId)
      
      if (error) {
        console.error('Error deleting table:', error)
        alert('Failed to delete dataset')
        return
      }
      
      // Update local state
      setSupabaseTables(supabaseTables.filter(t => t.id !== tableId))
    } else {
      // Use local store
      deleteTable(tableId)
    }
  }

  // Use Supabase data if available, otherwise fall back to local store
  // Map Supabase data to match local store format
  const displayFolders = supabaseFolders.length > 0 ? supabaseFolders : folders
  const displayTables = supabaseTables.length > 0 
    ? supabaseTables.map(t => ({
        ...t,
        folderId: t.folder_id,
        updatedAt: t.updated_at,
        createdAt: t.created_at
      }))
    : tables

  // Filter tables and folders based on search
  const filteredFolders = displayFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTables = displayTables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get tables not in any folder
  const uncategorizedTables = filteredTables.filter((t) => !(t as any).folder_id && !(t as any).folderId)
  
  // Helper function to get tables for a folder
  const getFolderTablesHelper = (folderId: string) => {
    return filteredTables.filter(t => (t as any).folder_id === folderId || (t as any).folderId === folderId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search datasets and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Workspace
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {displayTables.length} {displayTables.length === 1 ? 'dataset' : 'datasets'} · {displayFolders.length} {displayFolders.length === 1 ? 'folder' : 'folders'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
            <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Organize your datasets into folders
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Folder Name</label>
                    <Input
                      placeholder="e.g., Projects, Clients, Analytics"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {FOLDER_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setNewFolderColor(color.value)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            newFolderColor === color.value
                              ? 'ring-2 ring-offset-2 ring-primary scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateFolder} className="w-full">
                    Create Folder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Dataset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Dataset</DialogTitle>
                  <DialogDescription>
                    Create a new table to organize your data
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dataset Name</label>
                    <Input
                      placeholder="e.g., Customer List, Inventory, Tasks"
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateTable()}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Folder (Optional)</label>
                    <Select
                      value={selectedFolderId || 'none'}
                      onValueChange={(v) => setSelectedFolderId(v === 'none' ? null : v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Folder</SelectItem>
                        {displayFolders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateTable} className="w-full">
                    Create Dataset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Folders with Datasets Section */}
        {filteredFolders.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FolderPlus className="h-5 w-5 mr-2" />
              Folders & Datasets
            </h2>
            <div className="space-y-6">
              {filteredFolders.map((folder) => {
                const folderTables = getFolderTablesHelper(folder.id).filter((table) =>
                  table.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                const isExpanded = expandedFolders.has(folder.id)

                return (
                  <div
                    key={folder.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Folder Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: folder.color }}
                        >
                          <Folder className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {folder.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {folderTables.length} {folderTables.length === 1 ? 'dataset' : 'datasets'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFolderId(folder.id)
                            setShowTableDialog(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Dataset
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setRenamingItem({ type: 'folder', id: folder.id, name: folder.name })
                                setRenameDialogOpen(true)
                              }}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(`Delete folder "${folder.name}"? Datasets will not be deleted.`)) {
                                  handleDeleteFolder(folder.id)
                                }
                              }}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Folder Datasets */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                        {folderTables.length > 0 ? (
                          <div className={viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                            : "space-y-2"
                          }>
                            {folderTables.map((table) => {
                              const tableViews = views.filter((v) => v.tableId === table.id)
                              const colorRulesCount = tableViews.reduce((acc, v) => acc + v.colorRules.length, 0)
                              const filtersCount = tableViews.reduce((acc, v) => acc + v.filters.length, 0)

                              return (
                                <DatasetCard
                                  key={table.id}
                                  table={table}
                                  colorRulesCount={colorRulesCount}
                                  filtersCount={filtersCount}
                                  viewMode={viewMode}
                                  onClick={() => router.push(`/workspace/${table.id}`)}
                                  onRename={() => {
                                    setRenamingItem({ type: 'table', id: table.id, name: table.name })
                                    setRenameDialogOpen(true)
                                  }}
                                  onDelete={() => {
                                    if (confirm(`Delete dataset "${table.name}"? This cannot be undone.`)) {
                                      handleDeleteTable(table.id)
                                    }
                                  }}
                                  onMoveToFolder={() => {
                                    setMovingTableId(table.id)
                                    setMoveToFolderDialog(true)
                                  }}
                                />
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              No datasets in this folder yet
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedFolderId(folder.id)
                                setShowTableDialog(true)
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Dataset
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Datasets Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Grid3x3 className="h-5 w-5 mr-2" />
            {uncategorizedTables.length === filteredTables.length ? 'All Datasets' : 'Uncategorized Datasets'}
          </h2>
          {uncategorizedTables.length > 0 ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-2"
            }>
              {uncategorizedTables.map((table) => {
                const tableViews = views.filter((v) => v.tableId === table.id)
                const colorRulesCount = tableViews.reduce((acc, v) => acc + v.colorRules.length, 0)
                const filtersCount = tableViews.reduce((acc, v) => acc + v.filters.length, 0)

                return (
                  <DatasetCard
                    key={table.id}
                    table={table}
                    colorRulesCount={colorRulesCount}
                    filtersCount={filtersCount}
                    viewMode={viewMode}
                    onClick={() => router.push(`/workspace/${table.id}`)}
                    onRename={() => {
                      setRenamingItem({ type: 'table', id: table.id, name: table.name })
                      setRenameDialogOpen(true)
                    }}
                    onDelete={() => {
                      if (confirm(`Delete dataset "${table.name}"? This cannot be undone.`)) {
                        handleDeleteTable(table.id)
                      }
                    }}
                    onMoveToFolder={() => {
                      setMovingTableId(table.id)
                      setMoveToFolderDialog(true)
                    }}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Database className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? 'No datasets found' : 'No datasets yet'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowTableDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Dataset
                </Button>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renamingItem?.type === 'folder' ? 'Folder' : 'Dataset'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={renamingItem?.name || ''}
              onChange={(e) =>
                setRenamingItem(renamingItem ? { ...renamingItem, name: e.target.value } : null)
              }
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            />
            <Button onClick={handleRename} className="w-full">
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Move to Folder Dialog */}
      <Dialog open={moveToFolderDialog} onOpenChange={setMoveToFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
            <DialogDescription>
              Choose a folder for this dataset
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={selectedFolderId || 'none'}
              onValueChange={(v) => setSelectedFolderId(v === 'none' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Folder</SelectItem>
                {displayFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleMoveToFolder} className="w-full">
              Move
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
