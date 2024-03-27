const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    search: async (query) => {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });

        const categories = await prisma.categories.findMany({
            where: {
                category: {
                    contains: query
                }
            }
        });

        const components = await prisma.components.findMany({
            where: {
                name: {
                    contains: query
                }
            }
        });

        return { products, categories, components };
    }
};