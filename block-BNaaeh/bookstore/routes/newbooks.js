let express = require('express');
let router = express.Router();
let Newbook = require('../models/newbooks');

//list all books
router.get('/', (req, res, next) => {
    Newbook.find({}, (err, books) => {
        if(err) return next(err);
        res.status(200).json({books});
    })
});

//list a single book
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Newbook.findById(id).populate('comments').exec((err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//create a book
router.post('/', (req, res, next) => {
    Newbook.create(req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//update a book
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Newbook.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//delete a book
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Newbook.findByIdAndDelete(id, (err, book) => {
        if(err) return next(err);
        Comment.deleteMany({booksId: id}, (err, result) => {
            if(err) return next(err);
            res.status(200).json({book});
        })
        
    })
});

//add comments
router.post('/:id/comments', (req, res, next) => {
    let id = req.params.id;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);
        Newbook.findByIdAndUpdate(id, {$push: {comments: id}}, (err, book) => {
            if(err) return next(err);
            res.status(200).json({comment});
        })
    })
});




module.exports = router;