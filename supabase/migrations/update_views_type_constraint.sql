-- Drop the existing check constraint on views.type
ALTER TABLE views 
DROP CONSTRAINT IF EXISTS views_type_check;

-- Add the updated check constraint that includes 'chart'
ALTER TABLE views 
ADD CONSTRAINT views_type_check 
CHECK (type IN ('grid', 'gallery', 'form', 'kanban', 'calendar', 'chart'));

-- Add a comment to document the allowed types
COMMENT ON COLUMN views.type IS 'View type: grid, gallery, form, kanban, calendar, or chart';
