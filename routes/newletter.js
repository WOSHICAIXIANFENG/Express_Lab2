var express = require('express');
var router = express.Router();
var fs = require('fs');
const bodyParser = require('body-parser');
const urlencodeParser = bodyParser.urlencoded({ extended: false });

const {promisify} = require('util');
const appendFilePro = promisify(fs.appendFile);

const Rx = require('@reactivex/rxjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
     //res.send('respond with a resource');
     res.render('newsletter', {title: 'News Letter form'});
});

/* POST users listing. */
router.post('/', urlencodeParser, function (req, res) {
    console.log('you input email = ' + req.body.email);
    // validation email at here
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is invalid').isEmail();

    var errors = req.validationErrors();

    if (errors) res.render('error', {message: errors});
    else {
         // append email into subscribers.txt
        fs.appendFile('subscribers.txt', req.body.email + '\n', function (err) {
            if (err) throw err;
            console.log('email appended!');

            // redirect
            res.render('thankyou', {email: req.body.email});
        });

        // extend1: try to use util.promise to make fs.appendFile() return one promise
        // appendFilePro('subscribers.txt', req.body.email + '\n')
        //     .then(() => res.render('thankyou', {email: req.body.email}))
        //     .catch(() => res.render('error', {message: [{msg:'append file error'}]}));

        // extend2: try to use Observable to do this
        // let source = Rx.Observable.create((observer) => {
        //     fs.appendFile('subscribers.txt', req.body.email + '\n', function (err) {
        //             if (err) observer.error(err);
        //
        //             observer.next('sucessflag');
        //
        //             // why .complete() method not work.
        //             observer.complete();
        //     });
        // });
        //
        // source.subscribe(function (flag) {
        //     if (flag === 'sucessflag') {
        //         console.log('email appended!');
        //         // redirect
        //         res.render('thankyou', {email: req.body.email});
        //     }
        // }, err => res.render('error', {message: [{msg:'subscrible email fail'}]},
        // () => console.log('Done')));
    }
});

module.exports = router;
