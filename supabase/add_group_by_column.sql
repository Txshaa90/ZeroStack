-- Add group_by column to views table
-- Run this in Supabase SQL Editor

ALTER TABLE views ADD COLUMN IF NOT EXISTS group_by text;
