import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const userId = process.env.SEED_USER_ID!

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function removeDuplicates() {
  console.log('🔍 Checking for duplicate folders...')

  try {
    // Fetch all folders
    const { data: folders, error: foldersError } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (foldersError) throw foldersError

    console.log(`📁 Found ${folders.length} total folders`)

    // Group by name to find duplicates
    const foldersByName = new Map<string, any[]>()
    folders.forEach(folder => {
      const existing = foldersByName.get(folder.name) || []
      existing.push(folder)
      foldersByName.set(folder.name, existing)
    })

    // Find and remove duplicates (keep the oldest one)
    for (const [name, folderList] of foldersByName.entries()) {
      if (folderList.length > 1) {
        console.log(`\n⚠️  Found ${folderList.length} folders named "${name}"`)
        
        // Keep the first (oldest) one, delete the rest
        const toKeep = folderList[0]
        const toDelete = folderList.slice(1)
        
        console.log(`   ✅ Keeping: ${toKeep.id} (created: ${toKeep.created_at})`)
        
        for (const folder of toDelete) {
          console.log(`   ❌ Deleting: ${folder.id} (created: ${folder.created_at})`)
          
          const { error: deleteError } = await supabase
            .from('folders')
            .delete()
            .eq('id', folder.id)
          
          if (deleteError) {
            console.error(`   Error deleting ${folder.id}:`, deleteError)
          } else {
            console.log(`   ✓ Deleted successfully`)
          }
        }
      }
    }

    // Check tables/datasets
    console.log('\n🔍 Checking for duplicate datasets...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (tablesError) throw tablesError

    console.log(`📊 Found ${tables.length} total datasets`)

    const tablesByName = new Map<string, any[]>()
    tables.forEach(table => {
      const existing = tablesByName.get(table.name) || []
      existing.push(table)
      tablesByName.set(table.name, existing)
    })

    for (const [name, tableList] of tablesByName.entries()) {
      if (tableList.length > 1) {
        console.log(`\n⚠️  Found ${tableList.length} datasets named "${name}"`)
        
        const toKeep = tableList[0]
        const toDelete = tableList.slice(1)
        
        console.log(`   ✅ Keeping: ${toKeep.id} (created: ${toKeep.created_at})`)
        
        for (const table of toDelete) {
          console.log(`   ❌ Deleting: ${table.id} (created: ${table.created_at})`)
          
          const { error: deleteError } = await supabase
            .from('tables')
            .delete()
            .eq('id', table.id)
          
          if (deleteError) {
            console.error(`   Error deleting ${table.id}:`, deleteError)
          } else {
            console.log(`   ✓ Deleted successfully`)
          }
        }
      }
    }

    console.log('\n✅ Duplicate removal complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

removeDuplicates()
