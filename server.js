const express = require ('express');
const app = express(); 
const pg = require('pg');
const client = new pg.Client('postgres://localhost/poker')

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
    
    INSERT INTO tournaments (id, location, date) VALUES (1,'Caesars Palace', '2022-03-15');
    INSERT INTO tournaments (id, location, date) VALUES (2,'Aria Hotel', '2022-02-21');
    INSERT INTO tournaments (id, location, date) VALUES (3,'Bellagio', '2022-02-11');
    INSERT INTO tournaments (id, location, date, winner_id) VALUES (4,'Hard Rock', '2022-01-25', 1);
    INSERT INTO tournaments (id, location, date, winner_id) VALUES (5,'MGM Casino', '2021-11-17', 3);
    
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



app.get('/about', (req, res, next) => {
    const html = poker.map(info=> {
        return ``
    
    }).join("")
    res.send(html);
    res.end();
});
