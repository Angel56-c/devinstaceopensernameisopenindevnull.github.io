import Database from '@replit/database';
const db = new Database();

async function testDB() {
  await db.set('test_key', { example: 'data' });
  const value = await db.get('test_key');
  console.log('Retrieved value:', value);
}

testDB();