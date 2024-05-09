var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * get transactions
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM transactions ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('transactions', {
                data: ''
            });
        } else {
            //render to view transactions index
            res.render('transactions/index', {
                data: rows // <-- transactions data
            });
        }
    });
});

// /**
//  * input material
//  */
router.get('/create', function (req, res, next) {
    res.render('transactions/create', {
        vendor: '',
        customer: '',
        material_name: '',
        date: ''
    })
})

/**
 * post material_name
 */
router.post('/add', function (req, res, next) {
    
    let vendor   = req.body.vendor;
    let customer   = req.body.customer;
    let material_name   = req.body.material_name;
    var datetime = new Date();
    let errors  = false;

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to add.ejs with flash message
        res.render('transactions/create', {
            vendor: vendor,
            customer: customer,
            material_name: material_name,
            date: datetime.toISOString().slice(0,10),
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            vendor: vendor,
            customer: customer,
            material_name: material_name,
            date: datetime.toISOString().slice(0,10),
        }
        
        // insert query
        connection.query('INSERT INTO transactions SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('transactions/create', {
                    vendor: vendor,
                    customer: customer,
                    material_name: material_name,
                    date: datetime.toISOString().slice(0,10),
                })
            } else {                
                req.flash('success', 'data saved!');
                res.redirect('/transactions');
            }
        })
    }

})

/**
 * edit material_name
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM transactions WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if material_name not found
        if (rows.length <= 0) {
            req.flash('error', 'transaction with ID ' + id + " data not found")
            res.redirect('/transactions')
        }
        // if material_name found
        else {
            // render to edit.ejs
            res.render('transactions/edit', {
                id:      rows[0].id,
                vendor: rows[0].vendor,
                customer: rows[0].customer,
                material_name:   rows[0].material_name,
                date:   rows[0].date,
            })
        }
    })
})

/**
 * UPDATE material_name
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let vendor   = req.body.vendor;
    let customer   = req.body.customer;
    let material_name   = req.body.material_name;
    var datetime = new Date();
    let errors  = false;

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to edit.ejs with flash message
        res.render('transactions/edit', {
            id:         req.params.id,
            vendor:      vendor,
            customer:      customer,
            date:      datetime,
        })
    }

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to edit.ejs with flash message
        res.render('transactions/edit', {
            id:         req.params.id,
            vendor: vendor,
            customer: customer,
            material_name: material_name,
            date: datetime.toISOString().slice(0,10),
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            material_name: material_name,
        }

        // update query
        connection.query('UPDATE transactions SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('transactions/edit', {
                    id:     req.params.id,
                    vendor: vendor,
                    customer: customer,
                    material_name: material_name,
                    date: datetime.toISOString().slice(0,10),
                })
            } else {
                req.flash('success', 'success');
                res.redirect('/transactions');
            }
        })
    }
})

/**
 * DELETE material_name
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM transactions WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to transactions page
            res.redirect('/transactions')
        } else {
            // set flash message
            req.flash('success', 'success')
            // redirect to transactions page
            res.redirect('/transactions')
        }
    })
})

module.exports = router;

