const express= require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db= require('./db');
const app= express();
const port= 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret:'secret',
    resave: false,  
    saveUninitialized: true
}));
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err)throw err;
        if (results.length > 0) {
            req.session.user = results[0];
            if (results[0].role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/student');
            }
            }else {
                res.send('Invalid username or password');
            }
        });
    });
app.get('/admin', (req, res) => {
    if (req.session.user?.role!== 'admin') return res.redirect('/');
    res.render('admin_dashboard');
}); 
app.get('/student/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.render('products', { products: results,role:'student'});
    });
});
app.post('/student/products/add', (req, res) => {
  const { name, description, price } = req.body;
  db.query('INSERT INTO products SET ?', { name, description, price }, () => {
    res.redirect('/student/products');
  });
});
app.post('/student/products/update/:id', (req, res) => {
  const { name, description, price } = req.body;
  db.query('UPDATE products SET name=?, description=?, price=? WHERE id=?',
    [name, description, price, req.params.id], () => {
    res.redirect('/student/products');
  });
});
app.gey('/student/products/delete/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], () => {
    res.redirect('/student/products');
  });
});
app.get('/admin/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    res.render('users', { users: results });
  });
});
app.post('/admin/users/add', (req, res) => {
  const { username, password, role } = req.body;
  db.query('INSERT INTO users SET ?', { username, password, role }, () => {
    res.redirect('/admin/users');
  });
});
app.get('/admin/users/delete/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id=?', [req.params.id], () => {
    res.redirect('/admin/users');
  });
});
app.get('/admin/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    res.render('products', { products: results, role: 'admin' });
  });
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      req.session.user = result[0];
      if (result[0].role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/student');
      }
    } else {
      res.send('Invalid credentials');
    }
  });
});
app.get('/admin', (req, res) => {
  if (req.session.user?.role !== 'admin') return res.redirect('/');
  res.render('admin_dashboard');
});

app.get('/student', (req, res) => {
  if (req.session.user?.role !== 'student') return res.redirect('/');
  res.render('student_dashboard');
});
