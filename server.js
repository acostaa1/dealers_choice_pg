const express = require ('express');
const app = express();

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on port ${port}`));

app.use('/styles.css', (req, res, next) => {res.sendFile(path.join(__dirname, 'styles.css'))});

app.get('/about', (req, res, next) => {
    const html = poker.map(info=> {
        return ``
    
    }).join("")
    res.send(html);
    res.end();
});
