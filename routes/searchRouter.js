const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Books = require('../models/books');

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());
searchRouter.route('/')
    .get((req, res, next) => {
        Books.find({"image": "test.png"})
            .then((books) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(books);
            },
            (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = searchRouter;