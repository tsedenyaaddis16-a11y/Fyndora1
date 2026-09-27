import { getMampPool, initMampDatabase } from '../config/mampDb.js';

async function updateAdmin() {
  try {
    await initMampDatabase();
    const pool = getMampPool();
    const [result] = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = ?",
      ['tsedenyaaddis16@gmail.com']
    );
    console.log('Rows affected:', result.affectedRows);

    const [rows] = await pool.query(
      'SELECT id, name, email, role, country, grade FROM users WHERE email = ?',
      ['tsedenyaaddis16@gmail.com']
    );
    console.log('✅ User updated successfully:', rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error updating admin role:', err);
    process.exit(1);
  }
}

updateAdmin();
