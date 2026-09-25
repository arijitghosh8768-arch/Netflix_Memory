const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');

async function test() {
  const { data, error } = await supabase.storage.getBucket('our-story-media');
  if (error) {
    console.error('Bucket error:', error.message);
  } else {
    console.log('Bucket exists:', data.name, '| Public:', data.public);
  }
}
test();
