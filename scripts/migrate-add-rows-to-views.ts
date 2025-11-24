import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateAddRowsToViews() {
  console.log('🔄 Adding rows column to views table...')

  try {
    // Add rows column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'views' AND column_name = 'rows'
          ) THEN
            ALTER TABLE views ADD COLUMN rows jsonb DEFAULT '[]'::jsonb NOT NULL;
            RAISE NOTICE 'Column rows added successfully';
          ELSE
            RAISE NOTICE 'Column rows already exists';
          END IF;
        END $$;
      `
    })

    if (alterError) {
      console.error('❌ Error adding rows column:', alterError)
      return
    }

    console.log('✅ Migration completed successfully!')
    console.log('📝 Note: Existing views now have empty rows array. You may want to copy data from tables.rows to views.rows.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

migrateAddRowsToViews()
