const express = require ('express');
const app = express(); 
const pg = require('pg');
const client = new pg.Client('postgres://localhost/poker');
const path = require('path');

const port = process.env.PORT || 3000; 

app.use('/styles.css', (req, res, next) => {res.sendFile(path.join(__dirname, 'styles.css'))});

const syncAndSeed = async() => {
    const SQL = `DROP TABLE IF EXISTS players;
    DROP TABLE IF EXISTS tournaments;
    DROP TABLE IF EXISTS winners;
    
    CREATE TABLE players (id SERIAL PRIMARY KEY, 
    name VARCHAR(30) UNIQUE, 
    buy_in INTEGER, 
    tournament_id INTEGER);
    
    CREATE TABLE tournaments (id SERIAL PRIMARY KEY, 
    location VARCHAR(30) UNIQUE, 
    date DATE, 
    min_buy INTEGER,
    max_buy INTEGER,
    start_time TEXT,
    winner_id INTEGER);
    
    CREATE TABLE winners (id SERIAL PRIMARY KEY, 
    name VARCHAR(30), 
    chip_count INTEGER, 
    tournament_won INTEGER);
    
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(1, 'Stanley', '300', 1);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(2, 'Miyuki', '200', 1);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(3, 'Lina', '300', 1);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(4, 'Kim', '300', 1);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(5, 'Ken', '400', 1);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(6, 'Janie', '300', 2);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(7, 'Hannah', '300', 2);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(8, 'Eric', '300', 2);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(9, 'Channelle', '200', 2);
    INSERT INTO players (id, name, buy_in, tournament_id) VALUES(10, 'Angel', '400', 2);
    
    INSERT INTO tournaments (id, location, date, min_buy, max_buy, start_time) VALUES (1,'Caesars Palace', '2022-03-15',200, 500, '2PM');
    INSERT INTO tournaments (id, location, date, min_buy, max_buy, start_time) VALUES (2,'Aria Hotel', '2022-02-21',200, 500, '11AM');
    INSERT INTO tournaments (id, location, date, min_buy, max_buy, start_time) VALUES (3,'Bellagio', '2022-02-11',200, 500, '1PM');
    INSERT INTO tournaments (id, location, date, min_buy, max_buy, start_time, winner_id) VALUES (4,'Hard Rock', '2022-01-25',200, 500, '3PM', 1);
    INSERT INTO tournaments (id, location, date, min_buy, max_buy, start_time, winner_id) VALUES (5,'MGM Casino', '2021-11-17',200, 500, '5PM', 3);
    
    INSERT INTO winners (id, name, chip_count, tournament_won) VALUES (1, 'Stanley', 3000, 4);
    INSERT INTO winners (id, name, chip_count, tournament_won) VALUES (2, 'Lina', 5000, 5);`
    ;
    await client.query(SQL);
};

const setUp = async() => {
    try {
        await client.connect();
        await syncAndSeed();
        console.log(`connected to database`);
        app.listen(port, () => console.log(`listening on port ${port}`));

    } catch (error) {
        console.log(error);
    }
}

setUp();

app.get('/', async (req, res, next) => {
    try {
        const response = await client.query(`SELECT * FROM tournaments WHERE winner_id is NULL;`);
        const tournaments = response.rows;
        res.send(`<html>
        <head>
          <nav>
            <link rel= "stylesheet" href= "/styles.css">
            <ul>
              <li><a href= "/">Home</a></li>
              <li><a href ="/players">All Players</a></li>
              <li><a href = "/winners"> Past Winners</a></li>
            </ul>
          </nav>
        </head>
        <body>
          <h1>Upcoming Poker Tournaments</h1>
          <table id= "upcoming-tournaments">
            <tr>
             <th>#</th>
             <th>Location</th>
             <th>Date</th>
             <th>Sart Time<th>
             <th>Min Buy In<th>
             <th>Max Buy In<th>
             <th>Currently Registered<th>
            </tr> 
            <tr>
             ${tournaments.map(num => `<td>

             ${num.id}`).join('')}
             </td>
             <td></td>
             <td>Date</td>
             <td>Sart Time<td>
             <td>Min Buy In<td>
             <td>Max Buy In<td>
             <td><a href ="/players/caesars"> Currently Registered<a><td>
             
            </tr> 
            <tr>
             <td>#</td>
             <td>Location</td>
             <td>Date</td>
             <td>Sart Time<td>
             <td>Min Buy In<td>
             <td>Max Buy In<td>
             <td>Currently Registered<td>
            </tr> 
            <tr>
             <td>#</td>
             <td>Location</td>
             <td>Date</td>
             <td>Sart Time<td>
             <td>Min Buy In<td>
             <td>Max Buy In<td>
             <td>Currently Registered<td>
            </tr> 
          </table>
          <button><a href ="/players">Register</a></button>

        </body>
        </html>`);
    }
    catch (error) {
        console.log(error);
    }
    res.end();
});
app.get('/players', async (req, res, next) => {
    try {
        const response = await client.query(`SELECT * FROM players;`);
        const players = response.rows;
        res.send(`<html>
        <head>
          <nav>
            <ul>
              <li><a href = "/">Home</a></li>
              <li><a href = "/players">All Players</a></li>
              <li><a href = "/winners"> Past Winners</a></li>
            </ul>
          </nav>
        </head>
        <body>
          <h1>All Currently Registered Players</h1>
          <ul>
            ${players.map(player => `
              <li>
                ${player.name}
              </li>
            `).join('')
            
            }
          </ul>
    
          
            

         

        </body>
        </html>`);
    }
    catch (error) {
        console.log(error);
    }
    res.end();
});
app.get('/players/caesars', async (req, res, next) => {
    try {
        const response = await client.query(`SELECT * FROM players WHERE tournament_id = 1 ;`);
        const players = response.rows;
        res.send(`<html>
        <head>
          <nav>
            <ul>
              <li><a href= "/">Home</a></li>
              <li><a href ="/players">All Players</a></li>
              <li><a href = "/winners"> Past Winners</a></li>
            </ul>
          </nav>
        </head>
        <body>
          <h1>Currently Registered Players</h1>
          <h3> Caesars Tournament <h3>
          <ul>
            ${players.map(player => `
              <li>
                ${player.name}
              </li>
            `).join('')
            
            }
          </ul>
        </body>
        </html>`);
    }
    catch (error) {
        console.log(error);
    }
    res.end();
});

app.get('/winners', async (req, res, next) => {
    try {
        const response = await client.query(`SELECT * FROM winners ;`);
        const winners = response.rows;
        res.send(`<html>
        <head>
          <nav>
            <ul>
              <li><a href= "/">Home</a></li>
              <li><a href ="/players">All Players</a></li>
              <li><a href = "/winners"> Past Winners</a></li>
            </ul>
          </nav>
        </head>
        <body>
          <h1>All Past Winners</h1>
          <table id= "past-winners">
            <ul>
            ${winners.map(winner => `
              <li>
                ${winner.name}
              </li>
            `).join('')
            
            }
          </ul>

        </body>
        </html>`);
    }
    catch (error) {
        console.log(error);
    }
    res.end();
});
