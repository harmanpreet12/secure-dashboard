const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');  // Added sanitize-html
require('dotenv').config();

const app = express();
const PORT = 3000;

// Encryption setup
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.SESSION_SECRET || 'defaultsecret', 'salt', 32);
const iv = Buffer.alloc(16, 0);

// Decrypt function
function decrypt(text) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Encrypt function
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false
}));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Root route
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Simulated login
app.get('/login', (req, res) => {
  const emailEncrypted = encrypt('harman@example.com');
  const bioEncrypted = encrypt('I love coding securely!');

  req.session.user = {
    name: 'Harmanpreet Kaur',
    email: emailEncrypted,
    bio: bioEncrypted
  };
  res.redirect('/dashboard');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  let decryptedEmail = '';
  let decryptedBio = '';

  try {
    decryptedEmail = decrypt(req.session.user.email);
    decryptedBio = req.session.user.bio ? decrypt(req.session.user.bio) : '';
  } catch (err) {
    console.error('Decryption failed:', err);
  }

  res.render('dashboard', {
    name: req.session.user.name,
    email: decryptedEmail,
    bio: decryptedBio,
    errors: [],
    success: ''
  });
});

// Profile update route with validation, sanitization, and encryption
app.post('/profile/update',
  [
    body('name')
      .trim()
      .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters')
      .matches(/^[A-Za-z\s]+$/).withMessage('Name must only contain letters and spaces'),
    body('email')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('bio')
      .trim()
      .isLength({ max: 500 }).withMessage('Bio must be under 500 characters')
      .matches(/^[\w\s.,!?'"-]*$/).withMessage('Bio contains invalid characters')
  ],
  (req, res) => {
    // Sanitize bio to strip all HTML tags
    req.body.bio = sanitizeHtml(req.body.bio, {
      allowedTags: [],
      allowedAttributes: {}
    });

    const errors = validationResult(req);
    const { name, email, bio } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('dashboard', {
        name,
        email,
        bio,
        errors: errors.array(),
        success: ''
      });
    }

    try {
      const encryptedEmail = encrypt(email);
      const encryptedBio = encrypt(bio);

      req.session.user = {
        name,
        email: encryptedEmail,
        bio: encryptedBio
      };

      // Redirect back to dashboard after successful update
      res.redirect('/dashboard');
    } catch (err) {
      console.error('Encryption failed:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
