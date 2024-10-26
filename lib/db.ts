import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// データベース接続を初期化する関数
async function openDb() {
  return open({
    filename: './books.db',
    driver: sqlite3.Database
  })
}

export { openDb }
