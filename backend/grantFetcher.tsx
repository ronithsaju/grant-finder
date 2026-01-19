import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export async function getFilteredGrants() {
  const targetIds = [3, 5, 9, 20];
  
  try {
    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .in('id', targetIds);

    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error('Error fetching grants:', error);
    return [];
  }
}