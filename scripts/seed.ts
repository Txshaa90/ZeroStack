import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for seeding
const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  // Replace with your actual user ID from Supabase Auth
  const userId = process.env.SEED_USER_ID || 'YOUR_USER_ID_HERE'
  
  console.log('🌱 Starting seed process...')
  console.log(`📧 Using user ID: ${userId}`)

  // Folder definitions
  const foldersData = [
    { name: 'Amazon Returns', color: '#10b981' },
    { name: 'Clients', color: '#3b82f6' },
    { name: 'Projects', color: '#8b5cf6' },
  ]

  for (const folderData of foldersData) {
    console.log(`\n📁 Creating folder: ${folderData.name}`)
    
    const { data: folderRow, error: folderError } = await supabase
      .from('folders')
      .insert([{ ...folderData, user_id: userId }])
      .select()
      .single()

    if (folderError) {
      console.error('❌ Folder insert error:', folderError)
      continue
    }

    const folderId = folderRow.id
    console.log(`✅ Folder created with ID: ${folderId}`)

    // Define datasets based on folder
    let datasets: any[] = []
    
    if (folderData.name === 'Amazon Returns') {
      datasets = [
        {
          name: 'Returns Report',
          columns: [
            { id: 'c1', name: 'Order ID', type: 'text', width: 150 },
            { id: 'c2', name: 'Product', type: 'text', width: 200 },
            { id: 'c3', name: 'Return Date', type: 'date', width: 150 },
            { id: 'c4', name: 'Reason', type: 'select', width: 180, options: ['Defective', 'Wrong Item', 'Not Satisfied', 'Other'] },
            { id: 'c5', name: 'Refund Amount', type: 'number', width: 140 },
          ],
          rows: [
            { id: 'r1', c1: 'AMZ-12345', c2: 'Wireless Mouse', c3: '2024-11-10', c4: 'Defective', c5: '29.99' },
            { id: 'r2', c1: 'AMZ-12346', c2: 'USB Cable', c3: '2024-11-12', c4: 'Wrong Item', c5: '12.99' },
            { id: 'r3', c1: 'AMZ-12347', c2: 'Keyboard', c3: '2024-11-15', c4: 'Not Satisfied', c5: '79.99' },
          ],
        },
        {
          name: 'Orders Report',
          columns: [
            { id: 'c1', name: 'Order ID', type: 'text', width: 150 },
            { id: 'c2', name: 'Customer', type: 'text', width: 180 },
            { id: 'c3', name: 'Order Date', type: 'date', width: 150 },
            { id: 'c4', name: 'Status', type: 'select', width: 150, options: ['Pending', 'Shipped', 'Delivered', 'Cancelled'] },
            { id: 'c5', name: 'Total', type: 'number', width: 120 },
          ],
          rows: [
            { id: 'r1', c1: 'AMZ-54321', c2: 'John Smith', c3: '2024-11-20', c4: 'Delivered', c5: '149.99' },
            { id: 'r2', c1: 'AMZ-54322', c2: 'Jane Doe', c3: '2024-11-21', c4: 'Shipped', c5: '89.50' },
            { id: 'r3', c1: 'AMZ-54323', c2: 'Bob Johnson', c3: '2024-11-22', c4: 'Pending', c5: '299.99' },
          ],
        },
        {
          name: 'Inventory Report',
          columns: [
            { id: 'c1', name: 'SKU', type: 'text', width: 150 },
            { id: 'c2', name: 'Product Name', type: 'text', width: 200 },
            { id: 'c3', name: 'Stock', type: 'number', width: 120 },
            { id: 'c4', name: 'Status', type: 'select', width: 150, options: ['In Stock', 'Low Stock', 'Out of Stock'] },
            { id: 'c5', name: 'Price', type: 'number', width: 120 },
          ],
          rows: [
            { id: 'r1', c1: 'SKU-001', c2: 'Wireless Mouse', c3: '150', c4: 'In Stock', c5: '29.99' },
            { id: 'r2', c1: 'SKU-002', c2: 'USB Cable', c3: '25', c4: 'Low Stock', c5: '12.99' },
            { id: 'r3', c1: 'SKU-003', c2: 'Keyboard', c3: '0', c4: 'Out of Stock', c5: '79.99' },
          ],
        },
      ]
    } else if (folderData.name === 'Clients') {
      datasets = [
        {
          name: 'Client Contact List',
          columns: [
            { id: 'c1', name: 'Company', type: 'text', width: 200 },
            { id: 'c2', name: 'Contact Person', type: 'text', width: 180 },
            { id: 'c3', name: 'Email', type: 'email', width: 220 },
            { id: 'c4', name: 'Status', type: 'select', width: 150, options: ['Active', 'Inactive', 'Prospect'] },
            { id: 'c5', name: 'Contract Value', type: 'number', width: 150 },
          ],
          rows: [
            { id: 'r1', c1: 'Acme Corp', c2: 'Alice Williams', c3: 'alice@acme.com', c4: 'Active', c5: '50000' },
            { id: 'r2', c1: 'TechStart Inc', c2: 'Bob Chen', c3: 'bob@techstart.com', c4: 'Active', c5: '75000' },
            { id: 'r3', c1: 'Global Solutions', c2: 'Carol Davis', c3: 'carol@global.com', c4: 'Prospect', c5: '100000' },
          ],
        },
        {
          name: 'Project Timeline',
          columns: [
            { id: 'c1', name: 'Project', type: 'text', width: 200 },
            { id: 'c2', name: 'Client', type: 'text', width: 180 },
            { id: 'c3', name: 'Start Date', type: 'date', width: 150 },
            { id: 'c4', name: 'Status', type: 'select', width: 150, options: ['Planning', 'In Progress', 'Completed', 'On Hold'] },
            { id: 'c5', name: 'Completion %', type: 'number', width: 140 },
          ],
          rows: [
            { id: 'r1', c1: 'Website Redesign', c2: 'Acme Corp', c3: '2024-10-01', c4: 'In Progress', c5: '75' },
            { id: 'r2', c1: 'Mobile App', c2: 'TechStart Inc', c3: '2024-11-01', c4: 'Planning', c5: '20' },
            { id: 'r3', c1: 'CRM Integration', c2: 'Global Solutions', c3: '2024-09-15', c4: 'Completed', c5: '100' },
          ],
        },
      ]
    } else if (folderData.name === 'Projects') {
      datasets = [
        {
          name: 'Website Redesign',
          columns: [
            { id: 'c1', name: 'Task', type: 'text', width: 250 },
            { id: 'c2', name: 'Status', type: 'select', width: 150, options: ['Todo', 'In Progress', 'Done', 'Blocked'] },
            { id: 'c3', name: 'Assignee', type: 'text', width: 150 },
            { id: 'c4', name: 'Due Date', type: 'date', width: 150 },
            { id: 'c5', name: 'Priority', type: 'select', width: 120, options: ['Low', 'Medium', 'High'] },
          ],
          rows: [
            { id: 'r1', c1: 'Design mockups', c2: 'Done', c3: 'Alice', c4: '2024-11-15', c5: 'High' },
            { id: 'r2', c1: 'Develop frontend', c2: 'In Progress', c3: 'Bob', c4: '2024-12-01', c5: 'High' },
            { id: 'r3', c1: 'Backend API', c2: 'Todo', c3: 'Carol', c4: '2024-12-10', c5: 'Medium' },
          ],
        },
        {
          name: 'Marketing Campaign',
          columns: [
            { id: 'c1', name: 'Campaign', type: 'text', width: 200 },
            { id: 'c2', name: 'Platform', type: 'select', width: 150, options: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'] },
            { id: 'c3', name: 'Budget', type: 'number', width: 120 },
            { id: 'c4', name: 'Start Date', type: 'date', width: 150 },
            { id: 'c5', name: 'Status', type: 'select', width: 140, options: ['Planning', 'Active', 'Paused', 'Completed'] },
          ],
          rows: [
            { id: 'r1', c1: 'Q4 Launch', c2: 'Google Ads', c3: '5000', c4: '2024-10-01', c5: 'Active' },
            { id: 'r2', c1: 'Social Media Boost', c2: 'Facebook', c3: '3000', c4: '2024-11-01', c5: 'Active' },
            { id: 'r3', c1: 'Brand Awareness', c2: 'Instagram', c3: '2000', c4: '2024-11-15', c5: 'Planning' },
          ],
        },
        {
          name: 'Product Launch',
          columns: [
            { id: 'c1', name: 'Feature', type: 'text', width: 220 },
            { id: 'c2', name: 'Status', type: 'select', width: 150, options: ['Planned', 'In Development', 'Testing', 'Released'] },
            { id: 'c3', name: 'Owner', type: 'text', width: 150 },
            { id: 'c4', name: 'Release Date', type: 'date', width: 150 },
            { id: 'c5', name: 'Completion', type: 'number', width: 120 },
          ],
          rows: [
            { id: 'r1', c1: 'User Authentication', c2: 'Released', c3: 'Dev Team A', c4: '2024-10-15', c5: '100' },
            { id: 'r2', c1: 'Payment Integration', c2: 'Testing', c3: 'Dev Team B', c4: '2024-11-30', c5: '85' },
            { id: 'r3', c1: 'Analytics Dashboard', c2: 'In Development', c3: 'Dev Team C', c4: '2024-12-15', c5: '60' },
          ],
        },
        {
          name: 'Client Onboarding',
          columns: [
            { id: 'c1', name: 'Step', type: 'text', width: 220 },
            { id: 'c2', name: 'Status', type: 'select', width: 150, options: ['Not Started', 'In Progress', 'Completed', 'Skipped'] },
            { id: 'c3', name: 'Responsible', type: 'text', width: 150 },
            { id: 'c4', name: 'Due Date', type: 'date', width: 150 },
            { id: 'c5', name: 'Notes', type: 'text', width: 200 },
          ],
          rows: [
            { id: 'r1', c1: 'Initial consultation', c2: 'Completed', c3: 'Sales Team', c4: '2024-11-01', c5: 'Went well' },
            { id: 'r2', c1: 'Contract signing', c2: 'Completed', c3: 'Legal', c4: '2024-11-05', c5: 'Signed' },
            { id: 'r3', c1: 'System setup', c2: 'In Progress', c3: 'Tech Team', c4: '2024-11-20', c5: 'In progress' },
          ],
        },
      ]
    }

    // Insert datasets
    for (const dataset of datasets) {
      console.log(`  📊 Creating dataset: ${dataset.name}`)
      
      const { data: tableRow, error: tableError } = await supabase
        .from('tables')
        .insert([
          {
            name: dataset.name,
            user_id: userId,
            folder_id: folderId,
            columns: dataset.columns,
            rows: dataset.rows,
          },
        ])
        .select()
        .single()

      if (tableError) {
        console.error('  ❌ Dataset insert error:', tableError)
        continue
      }

      const tableId = tableRow.id
      console.log(`  ✅ Dataset created with ID: ${tableId}`)

      // Create 2 views per dataset
      const views = [
        {
          name: 'Grid View',
          type: 'grid',
          filters: [],
          sorts: [],
          color_rules: [],
          visible_columns: dataset.columns.map((c: any) => c.id),
        },
        {
          name: 'Kanban View',
          type: 'kanban',
          filters: [],
          sorts: [],
          color_rules: [],
          visible_columns: dataset.columns.map((c: any) => c.id),
          group_by: 'c2', // Group by status column
        },
      ]

      for (const view of views) {
        console.log(`    📋 Creating view: ${view.name}`)
        
        const { error: viewError } = await supabase
          .from('views')
          .insert([
            {
              ...view,
              user_id: userId,
              table_id: tableId,
            },
          ])

        if (viewError) {
          console.error('    ❌ View insert error:', viewError)
        } else {
          console.log(`    ✅ View created: ${view.name}`)
        }
      }
    }
  }

  console.log('\n✅ Seeding complete!')
  console.log('\n📊 Summary:')
  console.log('  - 3 folders created')
  console.log('  - 9 datasets created')
  console.log('  - 18 views created')
  console.log('  - 27 rows of sample data')
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .then(() => {
    console.log('\n🎉 All done! Check your Supabase dashboard.')
    process.exit(0)
  })
