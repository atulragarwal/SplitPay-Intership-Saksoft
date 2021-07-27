const localStrategy = require('passport-local').Strategy
const bcryptjs = require('bcryptjs')

const authenticateUser = async(uEmail, password, done) => {
    const user = getUserByEmail(email)
    if(user==null){
        return(done(null, false, {message : 'User Not Found! Try Signing Up.'}))
    }

    try{
        if(await bcryptjs.compare(password, user.password)){
            return(done(null, user))
        }
        else{
            return(done(null, false, {message : 'Incorrect Password'}))
        }
    }
    catch(err){
        return(done(err))
    }

}
function initialize(passport){
    passport.use(new localStrategy({usernameField : 'uEmail', passwordField : 'uPass'}), authenticateUser)
    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})
}

module.exports = initialize