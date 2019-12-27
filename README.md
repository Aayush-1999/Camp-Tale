# Camp-Tale

<a><img alt="David" src="https://img.shields.io/david/Aayush-1999/Blogrite?label=dependencies"></a>
<a><img alt="Code Quality" src="https://img.shields.io/badge/code%20quality-A-brightgreen"></a>

This is a **PWA** enabled **Web App** which provides complete Authentication and Registeration of all users with:
- Google
- Facebook
- Local Email

and where a user can:
- Create a Campground
- Tell a story about a campground
- Ask Questions about a campground.

### SERVER

The Server is made on `Node.js (v10.15.3)`
<br/>
`Express.js` is used as the server framework (v4.17.1)

### DATABASE

The database used is `MongoDB` and is hosted on a `MongoDB Atlas Cluster`.
<br/>
`Mongoose.js` is used as an ODM (v5.6.11)

### FRONT-END

- The Front-end is made with `HTML, CSS and JS`.
- `Bootstrap` is used for better styling of the project.
- `Font Awesome` for icons
- `Animate.css` and `Hover.css` for animations

### SECURITY

Many security precautions have been taken:
- ***bcrypt***: For secure password saving in the database.
- ***csurf***: For protection against CSRF attack on Forms and fetch requests.
- ***helmet***: For protection against common Security Vulnerabilities inExpress framework.
- ***Content Security Policy***: For Secure Content Delivery from the server.
- ***limiter***: For Limiting the access to data from a particular client (150 requests per hour).

### AUTHENTICATION

`Passport.js` has been integrated into the application for Secure Authentication of User Credentials over OAuth 2.0 from Google, Facebook, and Local Email Verification.

### MISC

`nodemailer` has been used for sending emails (Reset Password Link) to the users.
<br/>
`multer` has been used for uploading images and `cloudinary` for storing images.


### NPM Commands
- **npm install** - installs all the dependencies
- **npm start** - lints the server and client script, starts eslint on watch mode on server scripts and starts the project at localhost:1998 in debug mode.
- **npm run start-w** - Restarts the server(using nodemon) on every save and lints the server and client side scripts on each save.
- **Use npm run** --silent <your-script> to hide the internal logs from your terminal window.


### To-Do

- Use cookies securely
- Add proper Logging (Bunyan or Winston)
- Use CORS according to your project.
  - CORS allows other servers and domains to access/request your content. It is restricted by default
  - A possible use case could a public API project which is used by others to use your content.
  - you could use cors library to implement it.