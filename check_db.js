const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/tyre_bazaar'
});

async function run() {
  try {
    const res = await pool.query("SELECT id, business_name, mobile, email, is_verified FROM dealers WHERE email = $1", ['besttyres@gmail.com']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
