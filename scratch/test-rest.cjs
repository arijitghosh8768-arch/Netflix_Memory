const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');

async function test() {
  const { data, error } = await supabase.from('couples').select('*');
  console.log('Couples fetch:', error ? error.message : data);
}
test();
