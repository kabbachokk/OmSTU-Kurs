require('dotenv').config();

const 
    bcrypt      = require('bcryptjs'),
    express     = require('express'),
    passport    = require('passport'),
    Strategy    = require('passport-local').Strategy,
    path        = require('path'),
    model       = require('./model'),
    app         = express();

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 

app.disable('x-powered-by');

app.use(require('helmet')());
app.use(require('connect-flash')());
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({
    name: process.env.SESSION_NAME, 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false 
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy( 
    (username, password, cb) => {
        model.user.findByUsername(username).then(
            user => {
                if (!user) return cb(null, false, {message: 'Не верный логин или пароль.'});
                if (!bcrypt.compareSync(password, user.password)) return cb(null, false, {message: 'Не верный логин или пароль.'});
                return cb(null, user);
            },
            err => { return cb(err) }
        );
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});
  
passport.deserializeUser((id, cb) => {
    model.user.findById(id).then(
        user => cb(null, user),
        err => { if (err) return cb(err) } 
    ); 
});

app.use('/', require('./routes')(passport));


app.all('/404', (req, res) => {
    res.status(404).render('404');
});
app.all('/500', (req, res) => {
    res.status(500).render('500');
});

app.all('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(process.env.PORT);