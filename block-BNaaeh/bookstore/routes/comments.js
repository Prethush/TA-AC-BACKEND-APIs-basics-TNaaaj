let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Newbook = require('../models/newbooks');
//edit comment
router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        res.status(200).json({comment});
    })
});

//delete comment
router.delete('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if(err) return next(err);
        Newbook.findByIdAndUpdate(comment.bookId, {$pull: {comments: id}}, (err, book) => {
            if(err) return next(err);
            res.status(200).json({comment});
        })
    })
});

module.exports = router;