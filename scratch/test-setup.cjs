const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ruxinzqymhlypxivyjbp.supabase.co', 'sb_publishable_5N4xWqmUoUphXKT881A25g_g1kLwqyO');

async function test() {
  const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('our-story-media');
  console.log('Bucket check:', bucketError ? bucketError.message : bucketData.name);

  console.log('Trying to sign in or sign up...');
  let { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test' + Date.now() + '@example.com',
    password: 'password123'
  });
  
  if (authError) {
    console.log('SignUp error:', authError.message);
  } else {
    console.log('SignUp success!', authData.user?.id);
  }
}
test();
