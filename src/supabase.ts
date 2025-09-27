import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const project_url = 'https://lapqmprzbzjpwbbcdbao.supabase.co';
const public_anon_key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcHFtcHJ6YnpqcHdiYmNkYmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODg4MzAsImV4cCI6MjA3MzM2NDgzMH0.-5hFSbUE_3tCwT2Gk60D9vXx7wfeBO11ds1YMUAZecU';
export const supabase = createClient(project_url, public_anon_key);
