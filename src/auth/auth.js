import passport from 'koa-passport';
import local from 'passport-local'
import session from "../middlewares/custom-session";
import Accounts from "../database/models/Accounts";

// Passport middleware to handle user registration
passport.use('signup', new local.Strategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    try {
        //Save the information provided by the user to the the database
        const user = await Accounts.create({
            email,
            password
        });
        //Send the user information to the next middleware
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new local.Strategy({
    usernameField : 'email',
    passwordField : 'password'
}, async (email, password, done) => {
    try {
        //Find the user associated with the email provided by the user
        // const user = await UserModel.findOne({ email });
        const user = {};

        if( !user ){
            //If the user isn't found in the database, return a message
            return done(null, false, { message : 'User not found'});
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if( !validate ){
            return done(null, false, { message : 'Wrong Password'});
        }
        //Send the user information to the next middleware
        return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
        return done(error);
    }
}));

export function initiateAuth(app) {
    app
        // Session management
        .use(session())
        // Authentication
        .use(passport.initialize())
        .use(passport.session());
}
