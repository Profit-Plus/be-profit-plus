const { database } = require('../../helpers/utils/db/database');

async function createOffer(query_sheet_id, query_offer_name) {
    const offering = await database.offering.create({
        data: {
            sheet_id:query_sheet_id,
            offer_name:query_offer_name,
        },
    });

    const packages = await database.packages.findMany({
        where: {
            sheet_id: query_sheet_id
        }
    });
    

    const offering_package_map = [];
    for (const package of packages) {
        offering_package_map.push(await database.offering_package.create({
            data: {
                offering_id: offering.id,
                package_id: package.id
            },
        }
        ));
    }

    data = {offering, packages, offering_package_map}
    return data;
}

async function getOffering(query_sheet_id) {
    const offering = await database.offering.findMany({
            select:{
                id:true,
                sheet_id:true,
                offer_name:true,
                unit:true,
                user_target:true,
                offering_packages:{
                    orderBy:{
                        package:{
                            category:'asc'
                        }
                    },
                    select:{
                        package_id:true,
                        offering_id:true,
                        package_status:true,
                        package:{
                            select:{
                                id:true,
                                category:true,
                                name:true,
                                tariff:true,
                            },
                        },
                    },
                },
            },
            where: {
                sheet_id: query_sheet_id
            },
    });
    const count_offer_package = await database.offering_package.count({
        where: {
            offering_id: offering.id
        }
    }
    );

    const result = {offering, count_offer_package}
    return result;
}

async function updateOffer(query_offer_id, query_offer_name, query_unit, query_user_target){
    if (query_offer_name != null) {
        const offering = await database.offering.update({
            where: {
                id: query_offer_id
            },
            data: {
                offer_name: query_offer_name
            }
        });
        if (query_unit == null && query_user_target == null) {
            return offering;
        }
    }
    if (query_unit != null) {
        const offering = await database.offering.update({
            where: {
                id: query_offer_id
            },
            data: {
                unit: query_unit
            }
        });
        if (query_user_target == null) {
            return offering;
        }
    }

    if (query_user_target != null) {
        const offering = await database.offering.update({
            where: {
                id: query_offer_id
            },
            data: {
                user_target: query_user_target
            }
        });
        return offering;
    }
    return null;
}

async function updateStatusOffering(query_offer_id, query_package_id, query_status){
    const offering = await database.offering_package.update({
        where: {
            package_id_offering_id: {
                offering_id: query_offer_id,
                package_id: query_package_id 
            }
        },
        data: {
            package_status: query_status
        }
    });
    return offering;

}

module.exports = {
    createOffer,
    getOffering,
    updateOffer,
    updateStatusOffering
};