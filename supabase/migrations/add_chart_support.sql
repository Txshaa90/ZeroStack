-- 1️⃣ Add chart_config column if it doesn't exist
ALTER TABLE views
ADD COLUMN IF NOT EXISTS chart_config JSONB DEFAULT NULL;

-- 2️⃣ Update the type constraint to allow 'chart'
ALTER TABLE views
DROP CONSTRAINT IF EXISTS views_type_check;

ALTER TABLE views
ADD CONSTRAINT views_type_check
CHECK (type IN ('grid', 'gallery', 'form', 'kanban', 'calendar', 'chart'));

-- 3️⃣ Backfill existing chart views with default, chart-friendly configuration
UPDATE views
SET chart_config = jsonb_build_object(
    'chartType', 'bar',
    'xAxisField', '',
    'yAxisField', '',
    'aggregation', 'count'
)
WHERE type = 'chart' AND chart_config IS NULL;
