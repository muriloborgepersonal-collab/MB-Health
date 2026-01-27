
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdzvhgsgzdjzogjidiyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkenZoZ3NnemRqem9namlkaXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NTU5ODksImV4cCI6MjA4NTAzMTk4OX0.eMYgN2QBzmDh-3f2GqjOt7onye9FQABY0Z5aOwN5S4E';

export const supabase = createClient(supabaseUrl, supabaseKey);
