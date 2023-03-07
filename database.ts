import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {User} from './classe/Client'

export async function openDatabase() {
  const db = await open({
    filename: './mydatabase.db',
    driver: sqlite3.Database
  });
  return db;
}

async function createTable() {
    const db = await open({
      filename: './mydatabase.db',
      driver: sqlite3.Database
    });
  
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        boatsPositioned BOOLEAN NOT NULL DEFAULT FALSE,
        turn BOOLEAN NOT NULL DEFAULT FALSE,
        win INTEGER NOT NULL DEFAULT 0,
        losses INTEGER NOT NULL DEFAULT 0
    )
`);



    await db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        game_id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1 INTEGER NOT NULL,
        player2 INTEGER NOT NULL,
        isFinished BOOLEAN NOT NULL DEFAULT FALSE,
        tabuleiro TEXT NOT NULL,
        FOREIGN KEY (player1) REFERENCES users (user_id),
        FOREIGN KEY (player2) REFERENCES users (user_id)
      )
    `);
  }

  openDatabase()
  createTable()

export async function insertUser(nickname: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.db');

    const sql = `
      INSERT INTO users (nickname, password, boatsPositioned, turn, win, losses)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      nickname,
      password,
      false,
      false,
      0,
      0,
    ], function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
      db.close();
    });
  });
}


export async function getUserByNicknameAndPassword(nickname: string, password: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.db');

    const sql = `
      SELECT * FROM users
      WHERE nickname = ? AND password = ?
    `;

    db.get(sql, [nickname, password], function(error, row) {
      if (error) {
        reject(error);
      } else if (!row) {
        resolve(null);
      } else {
        const user: User = {
          user_id: row.user_id,
          nickname: row.nickname,
          password: row.password,
          boatsPositioned: !!row.boatsPositioned,
          turn: !!row.turn,
          win: row.win,
          losses: row.losses,
        };
        resolve(user);
      }
      db.close();
    });
  });
}
