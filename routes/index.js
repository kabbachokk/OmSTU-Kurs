const 
    router  = require('express').Router(),
    model   = require('../model');

module.exports = (passport) => {
    router.get('/', (req, res) => {
        let loggedIn = req.user ? true : false;
        res.render('index', { loggedIn });
    });

    router.post('/', (req, res) => {
        let year = req.body.year;
        if (!year) throw {status: 404, message: 'Вы должны указать год.'}; 
        model.event.getByYear(year).then(
                events => res.send(events),
                err => { 
                    console.error(err);
                    throw {status: 500, message: 'Что-то пошло не так.'};                     
                }
        );
    });
      
    router.get('/login', (req, res) => {
        if(req.user) res.redirect("/");
        else res.render('login', { error: req.flash('error')});
    });
        
    router.post(
        '/login', 
        passport.authenticate('local', { 
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash : true 
        }), 
        (req, res) => res.redirect('/')
    );
        
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    router.post('/view', (req, res) => {
        let id = req.body.id;
        console.log(id);
        if (!id) throw {status: 404, message: 'Вы должны указать год.'}; 
        model.event.getById(id).then(
                events => res.send(events),
                err => { 
                    console.error(err);
                    throw {status: 500, message: 'Что-то пошло не так.'};                     
                }
        );
    });

    router.get('/add', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        model.event.getStatus().then(
            status => res.render('add', { date: req.query.date, status, message: req.flash('message')}),
            err => { 
                console.error(err);
                throw {status: 500, message: 'Что-то пошло не так.'};                     
            }
        );
    });

    router.post('/add', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        model.event.add({
            statusID: req.body.status,
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            place: req.body.place,
            participants: req.body.participants,
            footing: req.body.footing,
            responsible: req.body.responsible
        }).then(
            status => res.redirect('/#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/add?date=' + req.body.date);                
            }
        );
    });

    router.get('/edit/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        model.event.getById(req.params.id).then(
            event => {
                model.event.getStatus().then(
                    status => res.render('edit', { status, event, message: req.flash('message')}),
                    err => { 
                        console.error(err);
                        throw {status: 500, message: 'Что-то пошло не так.'};                     
                    }
                ); 
            },
            err => { 
                console.error(err);
                throw {status: 500, message: 'Что-то пошло не так.'};               
            }
        );
    });

    router.post('/edit', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        let id = req.body.id;
        model.event.update(id, {
            statusID: req.body.status,
            title: req.body.title,
            link: req.body.link,
            date: req.body.date,
            place: req.body.place,
            participants: req.body.participants,
            footing: req.body.footing,
            responsible: req.body.responsible
        }).then(
            status => res.redirect('/#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/edit/' + id);                
            }
        );
    });

    router.post('/delete', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        let id = req.body.id;
        model.event.delete(id).then(
            status => res.redirect('/#'+ parseInt(req.body.date)),
            err => { 
                console.error(err);
                req.flash('message', 'Ошибка внесения в БД, пожалуйста проверьте данные.');   
                res.redirect('/edit/' + id);                
            }
        );
    });

    router.get('/download/report/:year', (req, res) => {
        const file = `${__dirname}/docx/buf/${generated}.docx`;
        res.download(file, 'request.pdf', (e) => {
            if (e & !res.headersSent) {
              // Handle error, but keep in mind the response may be partially-sent
              // so check res.headersSent
            } else {
              // decrement a download credit, etc.
            }
        }); 
    });

    router.get('/download/request/:year', (req, res) => {
        let file = `${__dirname}/docx/buf/${generated}.docx`;
        res.download(file, 'request.docx', (e) => {
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