require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/latest/:rover', async (req, res) => {
    
    const roverName = req.params.rover.toLowerCase();       
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/latest_photos?api_key=${process.env.API_KEY}`;
                
    try {
        const roverData = await fetch(url).then(res => res.json())
        res.send({roverData})
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))