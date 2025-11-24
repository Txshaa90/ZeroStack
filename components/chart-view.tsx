'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Column {
  id: string
  name: string
  type: string
}

interface Sheet {
  id: string
  name: string
  type: string
  rows: any[]
}

interface ChartViewProps {
  columns: Column[]
  rows: any[]
  sheets?: Sheet[]  // Available sheets to select from
  chartConfig?: {
    chartType: 'bar' | 'line' | 'pie'
    xAxisField: string
    yAxisField: string
    aggregation: 'count' | 'sum' | 'avg'
    sourceSheetId?: string  // Which sheet to pull data from
  }
  onConfigChange?: (config: any) => void
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']

export default function ChartView({ columns, rows, sheets, chartConfig, onConfigChange }: ChartViewProps) {
  // Initialize with first grid sheet or saved config
  const initialSheetId = chartConfig?.sourceSheetId || (sheets && sheets.find(s => s.type === 'grid')?.id) || ''
  
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>(chartConfig?.chartType || 'bar')
  const [xAxisField, setXAxisField] = useState<string>(chartConfig?.xAxisField || 'placeholder')
  const [yAxisField, setYAxisField] = useState<string>(chartConfig?.yAxisField || 'placeholder')
  const [aggregation, setAggregation] = useState<'count' | 'sum' | 'avg'>(chartConfig?.aggregation || 'count')
  const [sourceSheetId, setSourceSheetId] = useState<string>(initialSheetId)

  // Debug logging
  console.log('🔍 ChartView Props:', {
    columnsCount: columns?.length || 0,
    columns: columns?.map(c => ({ id: c.id, name: c.name })) || [],
    rowsCount: rows?.length || 0,
    chartConfig,
    xAxisField,
    yAxisField
  })

  // Alert if no columns
  if (!columns || columns.length === 0) {
    console.error('❌ ChartView: No columns provided!')
  }

  // Initialize sourceSheetId with first grid sheet if not set
  useEffect(() => {
    if (!sourceSheetId && sheets && sheets.length > 0) {
      const firstGridSheet = sheets.find(s => s.type === 'grid')
      if (firstGridSheet) {
        setSourceSheetId(firstGridSheet.id)
      }
    }
  }, [sheets, sourceSheetId])

  // Get the actual data to display based on selected sheet
  const displayRows = sourceSheetId && sheets 
    ? sheets.find(s => s.id === sourceSheetId)?.rows || rows
    : rows

  // Update parent when config changes
  useEffect(() => {
    if (onConfigChange && xAxisField) {
      onConfigChange({
        chartType,
        xAxisField,
        yAxisField,
        aggregation,
        sourceSheetId
      })
    }
  }, [chartType, xAxisField, yAxisField, aggregation, sourceSheetId, onConfigChange])

  // Get numeric columns for Y-axis
  const numericColumns = columns.filter(col => col.type === 'number')

  // Process data for charts with better aggregation (memoized for performance)
  const chartData = useMemo(() => {
    if (!xAxisField || xAxisField === 'placeholder') return []
    
    // Group data by X-axis field (aggregate counts)
    const grouped: Record<string, any[]> = {}

    for (const row of displayRows) {
      const xVal = String(row[xAxisField] || 'Unknown')
      if (!grouped[xVal]) {
        grouped[xVal] = []
      }
      grouped[xVal].push(row)
    }

    // Calculate aggregation
    const data = Object.entries(grouped).map(([key, items]) => {
      let value = 0
      
      if (aggregation === 'count') {
        value = items.length
      } else if (yAxisField && yAxisField !== 'placeholder') {
        const values = items
          .map(item => Number(item[yAxisField]))
          .filter(v => !isNaN(v) && v !== null && v !== undefined)
        
        if (values.length === 0) {
          value = 0
        } else if (aggregation === 'sum') {
          value = values.reduce((sum, v) => sum + v, 0)
        } else if (aggregation === 'avg') {
          value = values.reduce((sum, v) => sum + v, 0) / values.length
        }
      }

      return {
        name: key,
        value: Math.round(value * 100) / 100,
        count: items.length
      }
    })

    // Sort by value descending
    const sorted = data.sort((a, b) => b.value - a.value)
    
    // For pie charts, show ALL items (no limit) but sorted
    if (chartType === 'pie') {
      return sorted
    }
    
    // For bar/line charts, show top 20 for readability
    return sorted.slice(0, 20)
  }, [xAxisField, yAxisField, aggregation, displayRows, chartType])

  // Calculate insights
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0)
  const avgValue = chartData.length > 0 ? totalValue / chartData.length : 0
  const maxItem = chartData.length > 0 ? chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0]) : null
  const totalRecords = chartData.reduce((sum, item) => sum + item.count, 0)

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No data to display</p>
            <p className="text-sm mt-2">Select fields below to generate a chart</p>
          </div>
        </div>
      )
    }

    const chartHeight = Math.max(500, window.innerHeight - 350)

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={120}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {aggregation === 'count' ? 'Count' : yAxisField}: <span className="font-medium">{payload[0].value}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Records: {payload[0].payload.count}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="#8884d8" 
                name={aggregation === 'count' ? 'Count' : yAxisField}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={120}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].payload.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {aggregation === 'count' ? 'Count' : yAxisField}: <span className="font-medium">{payload[0].value}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Records: {payload[0].payload.count}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                name={aggregation === 'count' ? 'Count' : yAxisField}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={chartData.length <= 20 ? ({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%` : false}
                outerRadius={Math.min(200, chartHeight / 3)}
                fill="#8884d8"
                dataKey="value"
                animationDuration={chartData.length > 50 ? 0 : 400}
                isAnimationActive={chartData.length <= 100}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {chartData.length <= 30 && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  // Show error if no columns
  if (!columns || columns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
        <div className="text-center p-8">
          <p className="text-red-500 font-semibold text-lg mb-2">⚠️ No Columns Available</p>
          <p className="text-gray-600 dark:text-gray-400">
            The dataset has no columns defined. Please add columns to the dataset first.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      {/* Chart Controls */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-4">
          {/* Data Source Selection */}
          {sheets && sheets.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Source:</label>
                <Select 
                  value={sourceSheetId || 'placeholder'} 
                  onValueChange={setSourceSheetId}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select sheet" />
                  </SelectTrigger>
                  <SelectContent>
                    {!sourceSheetId && (
                      <SelectItem value="placeholder" disabled>
                        Select a sheet
                      </SelectItem>
                    )}
                    {sheets.filter(s => s.type === 'grid').map(sheet => (
                      <SelectItem key={sheet.id} value={sheet.id}>
                        {sheet.name} ({sheet.rows?.length || 0} rows)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            </>
          )}
          
          {/* Chart Type Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</span>
            <div className="flex gap-1">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Bar
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="h-4 w-4 mr-1" />
                Pie
              </Button>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Field Selection */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">X-Axis:</label>
              <Select value={xAxisField} onValueChange={setXAxisField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>Select field</SelectItem>
                  {columns.filter(col => col.id && col.id !== '').map(col => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Aggregation:</label>
              <Select value={aggregation} onValueChange={(v) => setAggregation(v as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {aggregation !== 'count' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Y-Axis:</label>
                <Select value={yAxisField} onValueChange={setYAxisField}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select numeric field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>Select field</SelectItem>
                    {numericColumns.filter(col => col.id && col.id !== '').map(col => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {chartData.length > 0 && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {chartData.length} categories from {rows.length} total rows
          </div>
        )}
      </div>

      {/* Insights Summary Cards */}
      {chartData.length > 0 && (
        <div className="px-6 pt-4 grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total {aggregation === 'count' ? 'Count' : 'Sum'}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{Math.round(totalValue).toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{Math.round(avgValue).toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Category</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{maxItem?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{maxItem?.value.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Records</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalRecords.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Chart Display */}
      <div className="flex-1 p-6 overflow-auto">
        {renderChart()}
      </div>
    </div>
  )
}
