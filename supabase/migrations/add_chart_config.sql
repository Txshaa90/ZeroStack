-- Add chart_config column to views table
ALTER TABLE views 
ADD COLUMN IF NOT EXISTS chart_config JSONB DEFAULT NULL;

-- Add a comment to document the column
COMMENT ON COLUMN views.chart_config IS 'Stores chart configuration: chartType, xAxisField, yAxisField, aggregation';

-- Example of what the data looks like:
-- {
--   "chartType": "bar",
--   "xAxisField": "category",
--   "yAxisField": "amount",
--   "aggregation": "sum"
-- }
