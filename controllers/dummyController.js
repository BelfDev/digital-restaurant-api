const User = require('../models/User');

exports.getDummy = (req, res, next) => {
    return User.findAll()
        .then(users => {
            // console.log(users);
            // res.sendStatus(200);

            res.status(200).json(
                {users: users}
            );
        })
        .catch(error => console.log(error));
};
