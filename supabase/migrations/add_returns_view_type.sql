-- Add 'returns' to the allowed view types

-- Drop the existing constraint
ALTER TABLE views
DROP CONSTRAINT IF EXISTS views_type_check;

-- Add the new constraint with 'returns' included
ALTER TABLE views
ADD CONSTRAINT views_type_check
CHECK (type IN ('grid', 'gallery', 'form', 'kanban', 'calendar', 'chart', 'returns'));
