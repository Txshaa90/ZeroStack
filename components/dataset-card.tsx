'use client'

import { Database, MoreVertical, Trash2, Edit2, FolderInput } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
interface DatasetCardProps {
  table: {
    id: string
    name: string
    rows: any[]
    updatedAt: string
  }
  colorRulesCount?: number
  filtersCount?: number
  viewMode?: 'grid' | 'list'
  onClick?: () => void
  onRename?: () => void
  onDelete?: () => void
  onMoveToFolder?: () => void
}

export function DatasetCard({
  table,
  colorRulesCount = 0,
  filtersCount = 0,
  viewMode = 'grid',
  onClick,
  onRename,
  onDelete,
  onMoveToFolder,
}: DatasetCardProps) {
  if (viewMode === 'list') {
    return (
      <div
        className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md hover:border-primary transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {table.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>{table.rows.length} rows</span>
              {colorRulesCount > 0 && <span>{colorRulesCount} color rules</span>}
              {filtersCount > 0 && <span>{filtersCount} filters</span>}
              <span className="text-xs">
                Updated {new Date(table.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onRename?.()
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onMoveToFolder?.()
              }}
            >
              <FolderInput className="h-4 w-4 mr-2" />
              Move to Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div
      className="group relative p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onRename?.()
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onMoveToFolder?.()
              }}
            >
              <FolderInput className="h-4 w-4 mr-2" />
              Move to Folder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
        {table.name}
      </h3>
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>{table.rows.length} rows</p>
        {colorRulesCount > 0 && <p>{colorRulesCount} color rules</p>}
        {filtersCount > 0 && <p>{filtersCount} filters</p>}
        <p className="text-xs">
          Updated {new Date(table.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
