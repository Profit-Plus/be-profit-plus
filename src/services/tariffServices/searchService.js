const { database } = require('../../helpers/utils/db/database');

async function searchProduct(query) {
    return database.product.findMany({
        where: {
            name: {
                contains: query
            }
        }
    });
}

async function searchCategory(query) {
    return database.categories.findMany({
        where: {
            category: {
                contains: query
            }
        }
    });
}

async function searchComponent(query) {
    return database.components.findMany({
        where: {
            name: {
                contains: query
            }
        }
    });
}

module.exports = {
    searchProduct,
    searchCategory,
    searchComponent
};
//     search: async (query) => {
//         const products = await database.product.findMany({
//             where: {
//                 name: {
//                     contains: query
//                 }
//             }
//         });

//         const categories = await database.categories.findMany({
//             where: {
//                 category: {
//                     contains: query
//                 }
//             }
//         });

//         const components = await database.components.findMany({
//             where: {
//                 name: {
//                     contains: query
//                 }
//             }
//         });

//         return { products, categories, components };
//     }
// };