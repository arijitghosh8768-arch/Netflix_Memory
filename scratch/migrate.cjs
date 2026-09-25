const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
async function run() {
  const cs = 'postgresql://postgres.ruxinzqymhlypxivyjbp:Gk%24%2FmbyiEF4DMT5@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: cs });
  await client.connect();
  const files = ['001_initial_schema.sql', '002_rls_policies.sql', '003_storage_policies.sql'];
  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations', file), 'utf8');
    console.log('Running ' + file);
    try {
      await client.query(sql);
      console.log('Successfully ran ' + file);
    } catch (e) {
      console.log('Error in ' + file + ': ' + e.message);
    }
  }
  await client.end();
  console.log('Done!');
}
run().catch(console.error);
