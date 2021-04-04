const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Books = require('../models/books');

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());

bookRouter.route('/')
    .get((req, res, next) => {
        Books.find({})
            .then((books) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(books);
            },
            (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Books.create(req.body)
            .then((book) => {
                console.log('Book created: ', book);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            },
            (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /books');
    })
    .delete((req, res, next) => {
        Books.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            },
            (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            },
            (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /books/' + req.params.bookId);
    })
    .put((req, res, next) => {
        Books.findByIdAndUpdate(req.params.bookId, {
            $set: req.body
        }, {
            new: true})
            .then((book) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(book);
            },
            (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Books.findByIdAndRemove(req.params.bookId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            },
            (err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId/sellers')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if(book != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.sellers);
                }
                else {
                    err = new Error('Book' + req.params.bookId + ' not found!');
                    err.status = 400;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if (book != null){
                    //book.sellers.push(req.body); // @pushall method not supported mongo 3.5 and above version, yo method deprecated gardeko xa
                    book.sellers = book.sellers.concat([req.body]); // So, use concat method instead.
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(book);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Book' + req.params.bookId + ' not found!');
                    err.status = 400;
                    return next(err);
                }
            },(err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /books/'
            + req.params.bookId + '/sellers');
    })
    .delete((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if (book != null){
                    for (var i = (book.sellers.length -1); i>= 0; i--){
                        book.sellers.id(book.sellers[i]._id).remove();
                    }
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(book);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Book' + req.params.bookId + ' not found!');
                    err.status = 400;
                    return next(err);
                }
            },(err) => next(err))
            .catch((err) => next(err));
    });

bookRouter.route('/:bookId/sellers/:sellerId')
    .get((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if(book != null && book.sellers.id(req.params.sellerId) != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.sellers.id(req.params.sellerId));
                }
                else if ( book == null ){
                    err = new Error('Book' + req.params.bookId + ' not found!');
                    err.status = 400;
                    return next(err);
                }
                else {
                    err = new Error('Seller' + req.params.sellerId + ' not found!');
                    err.status = 400;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /books/' + req.params.bookId
            + '/sellers/' + req.params.sellerId);
    })
    .put((req, res, next) => {
        Books.findById(req.params.bookId)
            .then((book) => {
                if (book != null && book.sellers.id(req.params.sellerId) != null) {
                    if (req.body.price) {
                        book.sellers.id(req.params.sellerId).price = req.body.price;
                    }
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(book);
                        }, (err) => next(err));
                }
                else if (book == null) {
                    err = new Error('book ' + req.params.bookId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Seller ' + req.params.sellerId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Books.findById(req.params.bookId)
        .then((book) => {
            if(book != null && book.sellers.id(req.params.sellerId) != null){
                book.sellers.id(req.params.sellerId).remove();
                book.save()
                    .then((book) => {        
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(book);
                    }, (err) = next(err))
                    .catch((err) => next(err));
            }
            else if ( book == null ){
                err = new Error('Book' + req.params.bookId + ' not found!');
                err.status = 400;
                return next(err);
            }
            else {
                err = new Error('Seller' + req.params.sellerId + ' not found!');
                err.status = 400;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    });

module.exports = bookRouter;