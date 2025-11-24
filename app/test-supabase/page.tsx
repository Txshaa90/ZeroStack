'use client'

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function TestSupabase() {
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true)
      setConfigured(isSupabaseConfigured())

      if (!isSupabaseConfigured()) {
        setLoading(false)
        return
      }

      try {
        // Test basic connection
        const { data, error: testError } = await supabase
          .from('folders')
          .select('count')
          .limit(1)

        if (testError) {
          setError(testError.message)
          setConnected(false)
        } else {
          setConnected(true)
          
          // Get list of tables
          const { data: tablesData, error: tablesError } = await supabase
            .from('folders')
            .select('*')
            .limit(5)

          if (!tablesError && tablesData) {
            console.log('Folders data:', tablesData)
          }
        }
      } catch (err: any) {
        setError(err.message)
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing your ZeroStack → Supabase connection
          </p>
        </div>

        <div className="space-y-6">
          {/* Configuration Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {configured ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <p className="font-medium">Environment Variables</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {configured ? 'Configured ✓' : 'Not configured ✗'}
                </p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {configured && (
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {loading ? (
                  <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                ) : connected ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <div>
                  <p className="font-medium">Database Connection</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {loading
                      ? 'Testing connection...'
                      : connected
                      ? 'Connected successfully ✓'
                      : 'Connection failed ✗'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="font-medium text-red-600 dark:text-red-400 mb-2">Error Details:</p>
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                💡 This might mean:
              </p>
              <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside mt-1">
                <li>Database tables haven't been created yet (run schema.sql)</li>
                <li>Row Level Security policies need to be configured</li>
                <li>Invalid Supabase URL or anon key</li>
              </ul>
            </div>
          )}

          {/* Success Message */}
          {connected && !loading && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-medium text-green-600 dark:text-green-400 mb-2">
                🎉 Supabase is connected!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your ZeroStack app can now use cloud storage. Check the browser console for folder data.
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                {connected ? (
                  <span className="text-green-600 dark:text-green-400">✓ Connection working!</span>
                ) : (
                  'Run the SQL schema in Supabase dashboard (supabase/schema.sql)'
                )}
              </li>
              <li>Enable Row Level Security policies in Supabase</li>
              <li>Sign up for an account at /auth/signup</li>
              <li>Start creating folders and datasets!</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/auth/signin" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
