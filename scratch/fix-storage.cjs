const { Client } = require('pg');
const cs = 'postgresql://postgres.ruxinzqymhlypxivyjbp:Gk%24%2FmbyiEF4DMT5@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
async function run() {
  const client = new Client({ connectionString: cs });
  await client.connect();
  
  const sql = `
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('our-story-media', 'our-story-media', false)
  ON CONFLICT (id) DO NOTHING;
  
  CREATE POLICY "Admins have full access to media bucket" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'our-story-media');
  `;
  try {
    await client.query(sql);
    console.log('Successfully ran storage policies');
  } catch (e) {
    console.log('Error: ' + e.message);
  }
  await client.end();
}
run().catch(console.error);
