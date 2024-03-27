const { database } = require('../../helpers/utils/db/database');

module.exports = {
    search: async (query) => {
        const products = await database.product.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });

        const categories = await database.categories.findMany({
            where: {
                category: {
                    contains: query
                }
            }
        });

        const components = await database.components.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });

        return { products, categories, components };
    }
};