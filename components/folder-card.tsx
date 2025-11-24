'use client'

import { Folder, MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FolderCardProps {
  folder: {
    id: string
    name: string
    color?: string
    createdAt: string
  }
  tableCount: number
  onClick?: () => void
  onRename?: () => void
  onDelete?: () => void
}

export function FolderCard({
  folder,
  tableCount,
  onClick,
  onRename,
  onDelete,
}: FolderCardProps) {
  return (
    <div
      className="group relative p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-primary transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: folder.color || '#10b981' }}
        >
          <Folder className="h-6 w-6 text-white" />
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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {folder.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {tableCount} {tableCount === 1 ? 'dataset' : 'datasets'}
      </p>
    </div>
  )
}
