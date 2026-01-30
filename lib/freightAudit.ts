// Add your Supabase project URL and anon key to your Vercel/Next.js environment variables.
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set for this to work.
import { supabase } from './supabase';

export async function saveFreightAudit({ shipper_email, pallet_count, zip_code, commodity }: {
  shipper_email: string;
  pallet_count: number;
  zip_code: string;
  commodity: string;
}) {
  const { data, error } = await supabase
    .from('freight_audits')
    .insert([
      { shipper_email, pallet_count, zip_code, commodity }
    ]);
  if (error) throw error;
  return data;
}
