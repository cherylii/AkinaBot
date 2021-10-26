const UserDB = require('./model/user')
module.exports.defineCurrency = currency => {
    Reflect.defineProperty(currency, 'addStar', {       
        value: async function addStar(id, amount) {
            const user = currency.get(id);
            if (user) {
                user.star += Number(amount);
                
            }
            try {
                const newUser = await Users.create({ user_id: id, balance: amount })
                currency.set(id, newUser);
                return newUser;
            }
            catch (error) {
                
            }
        },
    });
    Reflect.defineProperty(currency, 'getStar', {       
        value: function getStar(id) {
            const user = currency.get(id);
            return user ? user.balance : 0;
        },
    });

    Reflect.defineProperty(currency, 'addExp', {      
        value: async function addExp(id, amount) {
            const user = currency.get(id);
            if (user) {
                user.experience += Number(amount);
                return user.save();
            }
            try {
                const newUser = await Users.create({ user_id: id, experience: amount })
                currency.set(id, newUser);
                return newUser;
            }
            catch (error) {
                console.log(error)
            }
        },
    });
    Reflect.defineProperty(currency, 'getExp', {       
        value: function getExp(id) {
            const user = currency.get(id);
            return user ? user.experience : 0;
        },
    });

    Reflect.defineProperty(currency, 'addRep', {    
        value: async function addRep(id) {
            const user = currency.get(id);
            if (user) {
                user.reputation += 1;
                return user.save();
            }
            try {
                const newUser = await Users.create({ user_id: id, reputation: amount })
                currency.set(id, newUser);
                return newUser;
            }
            catch (error) {
                console.log(error)
            }
        },
    });
    Reflect.defineProperty(currency, 'getRep', {
        value: function getRep(id) {
            const user = currency.get(id);
            return user ? user.reputation : 0;
        },
    });
}