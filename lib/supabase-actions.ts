import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitHitchyardLead(email: string, companyName: string, palletCount: number, zipCode: string) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{ 
      email,
      company_name: companyName,
      pallet_count: palletCount,
      zip_code: zipCode
    }]);
  return { data, error };
}
