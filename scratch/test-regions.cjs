const { Client } = require('pg');
const regions = ['us-east-1','us-west-1','us-west-2','ap-southeast-1','ap-southeast-2','ap-northeast-1','ap-northeast-2','ap-south-1','sa-east-1','eu-west-1','eu-west-2','eu-west-3','eu-central-1','ca-central-1'];
async function run() {
  for (const r of regions) {
    const cs = `postgresql://postgres.ruxinzqymhlypxivyjbp:Gk%24%2FmbyiEF4DMT5@aws-0-${r}.pooler.supabase.com:6543/postgres`;
    console.log('Trying ' + r);
    const c = new Client({ connectionString: cs, connectionTimeoutMillis: 3000 });
    try {
      await c.connect();
      console.log('SUCCESS: ' + r);
      await c.end();
      return;
    } catch (e) {
      console.log('Failed: ' + e.message);
    }
  }
}
run();
