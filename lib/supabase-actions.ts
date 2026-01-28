import { createClient } from '@supabase/supabase-js'

// Using the keys for project: xqvhryexmqfyhyuxnaer
const supabaseUrl = 'https://xqvhryexmqfyhyuxnaer.supabase.co'
const supabaseAnonKey = 'sb_publishable_JfiqphW7DOBJf3PdtvX5GA_ifJ6hwZD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function submitHitchyardLead(email: string, reliability: number) {
  // HPS Logic: (Reliability * 0.4) + Baseline (5.2)
  const score = (reliability / 10 * 0.4) + 5.2;
  
  const { data, error } = await supabase
    .from('leads')
    .insert([{ 
      email, 
      reported_reliability: reliability, 
      hps_score: score 
    }]);
    
  return { data, error, score: score.toFixed(1) };
}
