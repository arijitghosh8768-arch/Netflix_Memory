const { Client } = require('pg');
const cs = 'postgresql://postgres.ruxinzqymhlypxivyjbp:Gk%24%2FmbyiEF4DMT5@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
async function run() {
  const client = new Client({ connectionString: cs });
  await client.connect();
  
  // Insert a mock user into auth.users directly to bypass email verification
  const sql = `
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('d0d9f456-4c45-4231-8935-4d7a8d9a444a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@ourstory.local', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now())
  ON CONFLICT (id) DO NOTHING;
  `;
  try {
    await client.query(sql);
    console.log('Successfully created test admin user');
  } catch (e) {
    console.log('Error: ' + e.message);
  }
  await client.end();
}
run().catch(console.error);
