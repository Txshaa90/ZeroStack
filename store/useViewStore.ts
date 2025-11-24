import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewType = 'grid' | 'gallery' | 'form' | 'kanban' | 'calendar'

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty' 
  | 'is_not_empty' 
  | 'gt' 
  | 'lt'
  | 'gte'
  | 'lte'

export interface FilterCondition {
  id: string
  columnId: string
  operator: FilterOperator
  value: string | number | boolean | Date
}

export interface ColorRule {
  id: string
  columnId: string
  operator: FilterOperator
  value: string | number | boolean | Date
  color: string // Tailwind class e.g., 'bg-green-100'
  textColor?: string // Optional text color
}

export interface Sort {
  field: string
  direction: 'asc' | 'desc'
}

export interface View {
  id: string
  name: string
  type: ViewType
  tableId: string
  filters: FilterCondition[]
  sorts: Sort[]
  colorRules: ColorRule[]
  visibleColumns: string[] // Column IDs that are visible in this view
  groupBy?: string
  createdAt: string
  updatedAt: string
}

interface ViewStore {
  views: View[]
  activeViewId: string | null
  
  // View operations
  addView: (tableId: string, name: string, type: ViewType, allColumnIds: string[]) => void
  deleteView: (id: string) => void
  updateView: (id: string, updates: Partial<View>) => void
  setActiveView: (id: string) => void
  getActiveView: () => View | undefined
  getViewsByTable: (tableId: string) => View[]
  
  // Filter operations
  addFilter: (viewId: string, filter: Omit<FilterCondition, 'id'>) => void
  updateFilter: (viewId: string, filterId: string, updates: Partial<FilterCondition>) => void
  removeFilter: (viewId: string, filterId: string) => void
  clearFilters: (viewId: string) => void
  
  // Sort operations
  addSort: (viewId: string, field: string, direction: 'asc' | 'desc') => void
  removeSort: (viewId: string, field: string) => void
  clearSorts: (viewId: string) => void
  
  // Color rule operations
  addColorRule: (viewId: string, rule: Omit<ColorRule, 'id'>) => void
  updateColorRule: (viewId: string, ruleId: string, updates: Partial<ColorRule>) => void
  removeColorRule: (viewId: string, ruleId: string) => void
  clearColorRules: (viewId: string) => void
  
  // Field visibility operations
  toggleColumnVisibility: (viewId: string, columnId: string) => void
  setVisibleColumns: (viewId: string, columnIds: string[]) => void
  showAllColumns: (viewId: string, allColumnIds: string[]) => void
  hideAllColumns: (viewId: string) => void
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set, get) => ({
      views: [
        // Website Redesign - Tasks Sheet
        {
          id: 'view-1',
          name: 'Tasks',
          type: 'grid',
          tableId: '7',
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c4', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Website Redesign - Milestones Sheet
        {
          id: 'view-2',
          name: 'Milestones',
          type: 'kanban',
          tableId: '7',
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c4', 'c5'],
          groupBy: 'c2', // Group by Status
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Marketing Campaign - Ads Sheet
        {
          id: 'view-3',
          name: 'Ads',
          type: 'grid',
          tableId: '8',
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c4', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Marketing Campaign - Budget Sheet
        {
          id: 'view-4',
          name: 'Budget',
          type: 'grid',
          tableId: '8',
          filters: [],
          sorts: [{ field: 'c3', direction: 'desc' }], // Sort by Budget descending
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Product Launch - Features Sheet
        {
          id: 'view-5',
          name: 'Features',
          type: 'grid',
          tableId: '9',
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c4', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Product Launch - Timeline Sheet
        {
          id: 'view-6',
          name: 'Timeline',
          type: 'grid',
          tableId: '9',
          filters: [],
          sorts: [{ field: 'c4', direction: 'asc' }], // Sort by Release Date
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c4', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Client Onboarding - Checklist Sheet
        {
          id: 'view-7',
          name: 'Checklist',
          type: 'grid',
          tableId: '10',
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c2', 'c3', 'c4', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        // Client Onboarding - Feedback Sheet
        {
          id: 'view-8',
          name: 'Feedback',
          type: 'grid',
          tableId: '10',
          filters: [{ id: 'f1', columnId: 'c2', operator: 'equals', value: 'Completed' }],
          sorts: [],
          colorRules: [],
          visibleColumns: ['c1', 'c5'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      activeViewId: null,

      addView: (tableId, name, type, allColumnIds) => {
        const newView: View = {
          id: `v${Date.now()}`,
          name,
          type,
          tableId,
          filters: [],
          sorts: [],
          colorRules: [],
          visibleColumns: allColumnIds, // All columns visible by default
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          views: [...state.views, newView],
          activeViewId: newView.id,
        }))
      },

      deleteView: (id) => {
        set((state) => {
          const newViews = state.views.filter((v) => v.id !== id)
          const newActiveId = state.activeViewId === id 
            ? (newViews[0]?.id || null)
            : state.activeViewId
          return { views: newViews, activeViewId: newActiveId }
        })
      },

      updateView: (id, updates) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
          ),
        }))
      },

      setActiveView: (id) => {
        set({ activeViewId: id })
      },

      getActiveView: () => {
        const state = get()
        return state.views.find((v) => v.id === state.activeViewId)
      },

      getViewsByTable: (tableId) => {
        return get().views.filter((v) => v.tableId === tableId)
      },

      // Filter operations
      addFilter: (viewId, filter) => {
        const newFilter: FilterCondition = {
          ...filter,
          id: `f${Date.now()}`,
        }
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, filters: [...v.filters, newFilter], updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      updateFilter: (viewId, filterId, updates) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? {
                  ...v,
                  filters: v.filters.map((f) =>
                    f.id === filterId ? { ...f, ...updates } : f
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : v
          ),
        }))
      },

      removeFilter: (viewId, filterId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { 
                  ...v, 
                  filters: v.filters.filter((f) => f.id !== filterId),
                  updatedAt: new Date().toISOString()
                }
              : v
          ),
        }))
      },

      clearFilters: (viewId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, filters: [], updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      // Sort operations
      addSort: (viewId, field, direction) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? {
                  ...v,
                  sorts: [...v.sorts.filter((s) => s.field !== field), { field, direction }],
                  updatedAt: new Date().toISOString(),
                }
              : v
          ),
        }))
      },

      removeSort: (viewId, field) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { 
                  ...v, 
                  sorts: v.sorts.filter((s) => s.field !== field),
                  updatedAt: new Date().toISOString()
                }
              : v
          ),
        }))
      },

      clearSorts: (viewId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, sorts: [], updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      // Color rule operations
      addColorRule: (viewId, rule) => {
        const newRule: ColorRule = {
          ...rule,
          id: `cr${Date.now()}`,
        }
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { 
                  ...v, 
                  colorRules: [...v.colorRules, newRule],
                  updatedAt: new Date().toISOString()
                }
              : v
          ),
        }))
      },

      updateColorRule: (viewId, ruleId, updates) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? {
                  ...v,
                  colorRules: v.colorRules.map((r) =>
                    r.id === ruleId ? { ...r, ...updates } : r
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : v
          ),
        }))
      },

      removeColorRule: (viewId, ruleId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { 
                  ...v, 
                  colorRules: v.colorRules.filter((r) => r.id !== ruleId),
                  updatedAt: new Date().toISOString()
                }
              : v
          ),
        }))
      },

      clearColorRules: (viewId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, colorRules: [], updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      // Field visibility operations
      toggleColumnVisibility: (viewId, columnId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? {
                  ...v,
                  visibleColumns: v.visibleColumns.includes(columnId)
                    ? v.visibleColumns.filter((c) => c !== columnId)
                    : [...v.visibleColumns, columnId],
                  updatedAt: new Date().toISOString(),
                }
              : v
          ),
        }))
      },

      setVisibleColumns: (viewId, columnIds) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, visibleColumns: columnIds, updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      showAllColumns: (viewId, allColumnIds) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, visibleColumns: allColumnIds, updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },

      hideAllColumns: (viewId) => {
        set((state) => ({
          views: state.views.map((v) =>
            v.id === viewId
              ? { ...v, visibleColumns: [], updatedAt: new Date().toISOString() }
              : v
          ),
        }))
      },
    }),
    {
      name: 'zerostack-views-enhanced',
    }
  )
)
