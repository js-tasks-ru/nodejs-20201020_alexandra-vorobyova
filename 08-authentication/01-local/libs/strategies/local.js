const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {

      return User.findOne({ email }, async function(err, user) {
        if (err) { 
          return done(null, false, 'Стратегия подключена, но еще не настроена'); 
        }

        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        }

        const isValidPassword = await user.checkPassword(password);

        if (!isValidPassword) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, user);
      })
      
    },
);
