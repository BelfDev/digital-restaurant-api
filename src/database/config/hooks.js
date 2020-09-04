
function withHooks(sequelize) {
    const {Accounts} = sequelize.models;

    // Account password hook
    Accounts.beforeCreate(async (account, options) => {
        const salt = sequelize.fn('gen_salt', 'bf', '4');
        account.password = sequelize.fn('crypt', account.password, salt);
    });

    //We'll use this later on to make sure that the user trying to log in has the correct credentials
    Accounts.prototype.isValidPassword = async function(password){
        const account = this;
        const salt = sequelize.fn('gen_salt', 'bf', '4');
        const hashedPassword = sequelize.fn('crypt', password, salt);
        return account.password === hashedPassword;
    }

}

module.exports = {withHooks};