module.exports = function(app, passport) {
​
    // LOGIN ===============================
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
​
//    app.get('/truckEntry', isLoggedIn, function(req, res) {
//        res.render('truckEntry.ejs'); 
//    });
​
​
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to home page section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
​
    // SIGNUP ==============================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
​
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true
    }));
​
    // PROFILE SECTION =====================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
​
};
​
​
​
​
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
​
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
​
    // if they aren't redirect them to the home page
    res.redirect('/');
}