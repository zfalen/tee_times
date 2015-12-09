var mongoose = require('mongoose');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user : req.user
        });
    });

    app.get('/cal', isLoggedIn, function(req, res){
        res.render('index.ejs',{ 
            user : req.user
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
  
    app.get('/contact', isLoggedIn, function(req, res) {
        res.render('contact.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/post', function(req, res) {
        res.render('blogForm.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    // AUTHENTICATE (FIRST LOGIN) ==================================================

    // LOGIN ===============================
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/cal', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // AUTHORIZE (ALREADY LOGGED IN)
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // app.get('/admin', isAdmin, function(req, res) {
    //     mongoose.model('User').find({}, function(err, users){
    //         if(err){
    //             return console.log(err);
    //         } else {
    //             res.render('adminProfile.ejs', {
    //                 users : users,
    //                 user : req.user
    //         });
    //     }
    // })});

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}

// // route middleware to make sure a user is admin
// function isAdmin(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated()){
//         res.redirect('/cal');
//         return next();
//     }

//     // if they aren't redirect them to the home page
//     res.redirect('/login');
// }