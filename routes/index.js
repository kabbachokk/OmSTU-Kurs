const 
    router  = require('express').Router(),
    model   = require('../model');

module.exports = (passport) => {
    router.get('/', (req, res) => {
        res.render('index', { user: req.user });
    });
      
    router.get('/login', (req, res) => res.render('login'));
        
    router.post(
        '/login', 
        passport.authenticate('local', { 
            successRedirect : '/add',
            failureRedirect : '/login',
            failureFlash : true 
        }), 
        (req, res) => res.redirect('/')
    );
        
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
      
    router.get('/edit/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        //res.render('profile', { user: req.user });
    });

    router.post('/edit/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        //res.render('profile', { user: req.user });
    });

    router.get('/add', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.render('profile', { user: req.user });
    });

    router.post('/add', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        //res.render('add', { user: req.user });
    });

    router.get('/delete/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.render('profile', { user: req.user });
    });

    router.get('/download/report', (req, res) => {
        const file = `${__dirname}/docx/buf/${generated}`;
        res.download(file, 'request.pdf', (e) => {
            if (e & !res.headersSent) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
            } else {
              // decrement a download credit, etc.
            }
        }); 
    });

    router.get('/download/request', (req, res) => {
        let file = `${__dirname}/docx/buf/${generated}`;
        res.download(file, 'request.pdf', (e) => {
            /*
            if (e & !res.headersSent) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
            } else {
                
            };
            */
            fs.unlinkSync(file);
        }); 
    });

    return router;
}