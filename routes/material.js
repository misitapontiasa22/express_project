var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * get materials
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM materials ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('materials', {
                data: ''
            });
        } else {
            //render to view materials index
            res.render('materials/index', {
                data: rows // <-- materials data
            });
        }
    });
});

// /**
//  * input material
//  */
router.get('/create', function (req, res, next) {
    res.render('materials/create', {
        material_name: ''
    })
})

/**
 * post material_name
 */
router.post('/add', function (req, res, next) {
    
    let material_name   = req.body.material_name;
    let errors  = false;

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to add.ejs with flash message
        res.render('materials/create', {
            material_name: material_name,
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            material_name: material_name,
        }
        
        // insert query
        connection.query('INSERT INTO materials SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('materials/create', {
                    material_name: formData.material_name,
                })
            } else {                
                req.flash('success', 'data saved!');
                res.redirect('/materials');
            }
        })
    }

})

/**
 * edit material_name
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM materials WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if material_name not found
        if (rows.length <= 0) {
            req.flash('error', 'material with ID ' + id + " data not found")
            res.redirect('/materials')
        }
        // if material_name found
        else {
            // render to edit.ejs
            res.render('materials/edit', {
                id:      rows[0].id,
                material_name:   rows[0].material_name,
            })
        }
    })
})

/**
 * UPDATE material_name
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let material_name   = req.body.material_name;
    let errors  = false;

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to edit.ejs with flash message
        res.render('materials/edit', {
            id:         req.params.id,
            material_name:      material_name
        })
    }

    if(material_name.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "please input material name");
        // render to edit.ejs with flash message
        res.render('materials/edit', {
            id:         req.params.id,
            material_name:      material_name
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            material_name: material_name,
        }

        // update query
        connection.query('UPDATE materials SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('materials/edit', {
                    id:     req.params.id,
                    material_name:   formData.material_name
                })
            } else {
                req.flash('success', 'success');
                res.redirect('/materials');
            }
        })
    }
})

/**
 * DELETE material_name
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM materials WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to materials page
            res.redirect('/materials')
        } else {
            // set flash message
            req.flash('success', 'success')
            // redirect to materials page
            res.redirect('/materials')
        }
    })
})

module.exports = router;

