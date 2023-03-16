import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {User} from './classe/Client'
import { Socket } from "net";
import { BattleShipGame } from './classe/BattleShipGame';


export async function openDatabase() {
  const db = await open({
    filename: './mydatabase.sqlite',
    driver: sqlite3.Database
  });
  return db;
}

async function createTable() {
    const db = await open({
      filename: './mydatabase.sqlite',
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

    // await db.exec(`
    //   CREATE TABLE IF NOT EXISTS games (
    //     game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     player1 INTEGER NOT NULL,
    //     player2 INTEGER NOT NULL,
    //     turn, INTEGET NOT NULL,
    //     isFinished BOOLEAN NOT NULL DEFAULT FALSE,
    //     boardPlayer1 TEXT NOT NULL,
    //     boardPlayer2 TEXT NOT NULL,
    //     FOREIGN KEY (player1) REFERENCES users (user_id),
    //     FOREIGN KEY (player2) REFERENCES users (user_id)
    //   )
    // `);

    db.run(`
    CREATE TABLE IF NOT EXISTS match_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loser INTEGER NOT NULL,
        winner INTEGER NOT NULL,
        FOREIGN KEY (loser) REFERENCES users (user_id),
        FOREIGN KEY (winner) REFERENCES users (user_id)
  )
`);
  }

  openDatabase()
  createTable()

export async function insertUser(nickname: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');

    const sql = `
      INSERT INTO users (nickname, password, boatsPositioned, turn, win, losses )
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


export async function getUserByNicknameAndPassword(nickname: string, password: string, socket: Socket): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');

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
          socket: socket
        };
        resolve(user);
      }
      db.close();
    });
  });
}

export async function insertMatchHistory(idWinner: number, idLoser: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');
    const sql = `
      INSERT INTO match_history (winner, loser)
      VALUES (?, ?)
    `;

    db.run(sql, [
      idWinner,
      idLoser,
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

export async function getUserMatches(userId: number): Promise<{ id: number, winner: string, loser: string }[]> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');
    const sql = `
      SELECT mh.id, w.nickname as winner, l.nickname as loser
      FROM match_history mh
      INNER JOIN users w ON mh.winner = w.user_id
      INNER JOIN users l ON mh.loser = l.user_id
      WHERE mh.winner = ? OR mh.loser = ?
    `;
    db.all(sql, [userId, userId], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        const matches = rows.map(row => ({ id: row.id, winner: row.winner, loser: row.loser }));
        resolve(matches);
      }
      db.close();
    });
  });
}


export async function incrementLosses(userId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');
    const sql = `
      UPDATE users
      SET losses = losses + 1
      WHERE user_id = ?
    `;
    db.run(sql, [userId], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
      db.close();
    });
  });
}

export async function incrementWin(userId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydatabase.sqlite');
    const sql = `
      UPDATE users
      SET win = win + 1
      WHERE user_id = ?
    `;
    db.run(sql, [userId], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
      db.close();
    });
  });
}