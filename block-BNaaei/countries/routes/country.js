let express = require('express');
let router = express.Router();
let Country = require('../models/country');
let State = require('../models/states');

//list all countries
router.get('/', (req, res, next) => {
    Country.find({}).sort({"name": 1}).exec((err, countries) => {
        if(err) return next(err);
        res.status(200).json({countries});
    })
});

//add a country
router.post('/', (req, res, next) => {
    req.body.ethnicity = req.body.ethnicity.trim().split(" ");
    Country.create(req.body, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

//list a specific country
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Country.findById(id, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

//update a country
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.ethnicity = req.body.ethnicity.trim().split(" ");
    Country.findByIdAndUpdate(id, req.body, (err, country) => {
        if(err) return next(err);
        console.log(country);
        res.status(200).json({country});
    })
});

//delete a country
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Country.findByIdAndDelete(id, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

//add neighbouring countries
router.put('/:id/addneighbour', (req, res, next) => {
    let id = req.params.id;
    console.log(id);
    let {name} = req.body;
    Country.findOne({name}, (err, country) => {
        console.log(country);
        if(err) return next(err);
        Country.findByIdAndUpdate(id, {$push: {neighbours: country.id}}, (err, upcountry) => {
            if(err) return next(err);
            res.status(200).json({upcountry});
        })
    })
});


//add a state
router.post('/:id/states', (req, res, next) => {
    let id = req.params.id;
    req.body.country = id;
    State.create(req.body, (err, state) => {
        if(err) return next(err);
        Country.findByIdAndUpdate(id, {$push: {states: state.id}}, (err, country) => {
            if(err) return next(err);
            res.status(200).json({state});
        })
    })
});

//list all states
router.get('/:id/states', (req, res, next) => {
    let id = req.params.id;
    Country.findById(id).populate({path: 'states', select: 'name', options: {sort: {'name': -1}}}).exec((err, country) => {
        if(err) return next(err);
        res.status(200).json({states: country.states});
    })
})

//list all the neighbouring countries
router.get('/:id/neighbours', (req, res, next) => {
    let id = req.params.id;
    Country.findById(id).populate('neighbours').exec((err, country) => {
        if(err) return next(err);
        res.status(200).json({neighbours: country.neighbours});
    })
});

//list all religions 
router.get('/find/religions', (req, res, next) => {
    Country.find({}).distinct('ethnicity').exec((err, result) => {
        if(err) return next(err);
        res.status(200).json({result});
    })
});

//list countries based on continent
router.get('/find/continent/:id', (req, res, next) => {
    let continent = req.params.id;
    Country.find({continent}, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

//list countries based on population
router.get('/find/population/:id', (req, res, next) => {
    let population = req.params.id;
    Country.find({population}, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

//list countries based on ethnicity
router.get('/find/ethnicity/:id', (req, res, next) => {
    let ethnicity = req.params.id;
    Country.find({ethnicity: {$in: ethnicity}}, (err, country) => {
        if(err) return next(err);
        res.status(200).json({country});
    })
});

module.exports = router;