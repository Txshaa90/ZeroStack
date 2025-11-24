'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DebugEnv() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50),
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      keyFull: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Supabase URL</h2>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded break-all">
            {envVars.url || 'NOT SET'}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Length: {envVars.urlLength || 0} characters
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Supabase Anon Key (First 50 chars)</h2>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded break-all">
            {envVars.keyPrefix || 'NOT SET'}...
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Length: {envVars.keyLength || 0} characters
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Expected: ~200+ characters for JWT token
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Full Anon Key</h2>
          <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 p-4 rounded break-all max-h-40 overflow-auto">
            {envVars.keyFull || 'NOT SET'}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Expected Values:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ URL: https://fcwpepubyyoanzqhcruo.supabase.co</li>
            <li>✅ Key starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</li>
            <li>✅ Key length: ~200+ characters</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link href="/test-supabase">
            <Button>Test Supabase Connection</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
