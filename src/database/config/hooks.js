
function withHooks(sequelize) {
    const {Accounts} = sequelize.models;

    // Account password hook
    Accounts.beforeCreate(async (account, options) => {
        const salt = sequelize.fn('gen_salt', 'bf', '4');
        account.password = sequelize.fn('crypt', account.password, salt);
    });

    //We'll use this later on to make sure that the user trying to log in has the correct credentials
    Accounts.prototype.isValidPassword = async function(password){
        const query = `SELECT user_id FROM accounts WHERE password = crypt(\'${password}\', \'${this.password}\')`;
        const account = await sequelize.query(query, {
            model: Accounts,
            mapToModel: true // pass true here if you have any mapped fields
        });
        return account.length > 0
    }
}

module.exports = {withHooks};