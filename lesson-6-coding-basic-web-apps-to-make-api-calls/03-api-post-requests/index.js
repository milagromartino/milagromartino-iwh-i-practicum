require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {

    const plants = 'https://api.hubapi.com/crm/v3/objects/2-70079458?properties=name,species,bio';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(plants, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }

});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const newPlant = {
        properties: {
            "name": req.body.name,
            "species": req.body.species,
            "bio": req.body.bio
        }
    }

    const createPlant = 'https://api.hubapi.com/crm/v3/objects/2-70079458';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createPlant, newPlant, { headers });
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));