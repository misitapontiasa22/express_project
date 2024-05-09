var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * get user
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM users ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('users', {
                data: ''
            });
        } else {
            //render to view users index
            res.render('users/index', {
                data: rows // <-- users data
            });
        }
    });
});

// /**
//  * input user
//  */
router.get('/create', function (req, res, next) {
    res.render('users/create', {
        username: ''
    })
})

/**
 * post user
 */
router.post('/add', function (req, res, next) {
    
    let username   = req.body.username;
    let errors  = false;

    if(username.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input username");
        // render to add.ejs with flash message
        res.render('users/create', {
            username: username,
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            username: username,
        }
        
        // insert query
        connection.query('INSERT INTO users SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('users/create', {
                    username: formData.username,
                })
            } else {                
                req.flash('success', 'data saved!');
                res.redirect('/users');
            }
        })
    }

})

/**
 * edit user
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'user with ID ' + id + " data not found")
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                id:      rows[0].id,
                username:   rows[0].username,
            })
        }
    })
})

/**
 * UPDATE user
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let username   = req.body.username;
    let errors  = false;

    if(username.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input username");
        // render to edit.ejs with flash message
        res.render('users/edit', {
            id:         req.params.id,
            username:      username
        })
    }

    if(username.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input username");
        // render to edit.ejs with flash message
        res.render('users/edit', {
            id:         req.params.id,
            username:      username
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            username: username,
        }

        // update query
        connection.query('UPDATE users SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id:     req.params.id,
                    username:   formData.username
                })
            } else {
                req.flash('success', 'success');
                res.redirect('/users');
            }
        })
    }
})

/**
 * DELETE user
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to users page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'success')
            // redirect to users page
            res.redirect('/users')
        }
    })
})

module.exports = router;

