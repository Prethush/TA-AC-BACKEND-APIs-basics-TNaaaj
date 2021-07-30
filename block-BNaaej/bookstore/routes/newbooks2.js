let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Updatedbook = require('../models/newbooks2');

//list all books
router.get('/', (req, res, next) => {
    Updatedbook.find({}, (err, books) => {
        if(err) return next(err);
        res.status(200).json({books});
    })
});

//list a single book
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Updatedbook.findById(id).populate('comments').exec((err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//create a book
router.post('/', (req, res, next) => {
    Updatedbook.create(req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//update a book
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Updatedbook.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//delete a book
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Updatedbook.findByIdAndDelete(id, (err, book) => {
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
    req.body.bookId = id;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);
        Updatedbook.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, book) => {
            if(err) return next(err);
            res.status(200).json({comment});
        })
    })
});

//create a category
router.put('/:id/addCategory', (req, res, next) => {
    let id = req.params.id;
    req.body.category = req.body.category.trim().split(" ");
    Updatedbook.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//edit a category
router.put('/:id/editCategory', (req, res, next) => {
    let id = req.params.id;
    req.body.category = req.body.category.trim().split(" ");
    Updatedbook.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//list all categories
router.get('/list/Category', (req, res, next) => {
    Updatedbook.find({}).distinct('category').exec((err, category) => {
        if(err) return next(err);
        res.status(200).json({category})
    })
});

//list books by category
router.get('/list/category/:id', (req, res, next) => {
    let category = req.params.id;
    Updatedbook.find({category}, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

//count books by category
router.get('/countby/category', (req, res, next) => {
    Updatedbook.aggregate([
        {$unwind: "$category"},
        {$group: {_id: "$category", count: {$sum: 1}}}
    ]).exec((err, result) => {
        if(err) return next(err);
       res.status(200).json({result});
    })
});

//list book by author
router.get('/filter/byauthor', (req, res, next) => {
    Updatedbook.aggregate([
        {$project: {
            author: '$author',
            book: '$title'
        }}
        

    ]).exec((err, result) => {
        if(err) return next(err);
        res.status(200).json({result});
    })
});

//add tags to books
router.put('/:id/addtags', (req, res, next) => {
    let id = req.params.id;
    req.body.tags = req.body.tags.trim().split(" ");
    Updatedbook.findByIdAndUpdate(id, req.body, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
})

//list all tags in ascending order
router.get('/filter/tags', (req, res, next) => {
    Updatedbook.aggregate([
        {$unwind: '$tags'},
        {$sort: {'tags': 1}}
    ]).exec((err, result) => {
        if(err) return next(err);
        res.status(200).json({result});
    })
    
});

//filter books by category
router.get('/list/tags/:id', (req, res, next) => {
    let tags = req.params.id;
    Updatedbook.find({tags}, (err, book) => {
        if(err) return next(err);
        res.status(200).json({book});
    })
});

router.get('/countby/tags', (req, res, next) => {
    Updatedbook.aggregate([
        {$unwind: "$tags"},
        {$group: {_id: "$tags", count: {$sum: 1}}}
    ]).exec((err, result) => {
        if(err) return next(err);
       res.status(200).json({result});
    })
});
module.exports = router;