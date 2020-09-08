
function withHooks(sequelize) {
    const {Accounts, Products, CartItems, Carts, OrderCarts, Orders, Payments} = sequelize.models;

    // Account password hook
    Accounts.beforeCreate(async (account, options) => {
        const salt = sequelize.fn('gen_salt', 'bf', '4');
        account.password = sequelize.fn('crypt', account.password, salt);
    });

    //We'll use this later on to make sure that the user trying to log in has the correct credentials
    Accounts.prototype.isValidPassword = async function (password) {
        const query = `SELECT user_id FROM accounts WHERE password = crypt(\'${password}\', \'${this.password}\')`;
        const account = await sequelize.query(query, {
            model: Accounts,
            mapToModel: true // pass true here if you have any mapped fields
        });
        return account.length > 0
    }

    // Calculating cart item total
    CartItems.beforeBulkCreate(async (items, options) => {
        const productIds = items.map((item) => item.productId);
        const products = await Products.findAll({
            where: {
                id: productIds
            }
        })
        items.forEach((item, index) => {
            item.total = products[index].unitPrice * item.quantity;
        });

    });

    // Calculating cart subtotal
    CartItems.afterBulkCreate(async (items, options) => {
        const id = items[0].cartId;
        const cart = await Carts.findByPk(id, {
            include: [
                {
                    model: Products,
                    as: 'items',
                    attributes: {
                        exclude: ['id']
                    },
                    through: {
                        as: 'cartItem',
                        through: {attributes: []}

                    }
                },
            ],
            attributes: {
                exclude: [
                    'cartItemId', 'outletId', 'sessionId', 'createdOn', 'updatedOn',
                ]
            },
        });
        const allTotals = cart.items.map((item) => item.cartItem.total);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        cart.subtotal = allTotals.reduce(reducer);
        await cart.save();
    });

    // Updating cart statuses
    OrderCarts.beforeBulkCreate(async (orderCart) => {
        const cartId = orderCart[0].cartId;
        await Carts.update(
            {
                status: 'ORDERED'
            },
            {
                where: {
                    id: cartId
                },
            },
        );
        await CartItems.update(
            {
                status: 'PREPARING'
            }, {
                where: {
                    cartId: cartId
                }
            }
        );
    })

    OrderCarts.afterBulkCreate(async (orderCart) => {
        const orderId = orderCart[0].orderId;

        const order = await Orders.findByPk(orderId, {
            include: [
                {
                    model: Carts,
                    as: 'carts',
                    through: {attributes: []},
                },
            ],
            attributes: {
                exclude: [
                    'createdOn',
                    'updatedOn'
                ]
            },
        });
        const allTotals = order.carts.map((cart) => cart.subtotal);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        order.subtotal = allTotals.reduce(reducer);
        await order.save();
    });

    Payments.beforeCreate(async (payment) => {
        const order = await Orders.findByPk(payment.orderId);
        order.status = "PAID";
        await order.save();
        payment.total = order.subtotal;
    });

}

module.exports = {withHooks};