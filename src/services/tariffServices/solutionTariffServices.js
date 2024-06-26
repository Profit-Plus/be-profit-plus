const e = require('express');
const { database } = require('../../helpers/utils/db/database');
const { equal } = require('assert');

async function getSolutionGTOMTariff(query_product_id) {
    const solutionSheet = await database.sso.findFirst({
        where: {
            product_overview_id:query_product_id
        },
        select : {
            id: true,
            sheet:{
                select: {
                    offering:{
                        select: {
                            offer_name:true,
                            offering_packages:{
                                select:{
                                    package:{
                                        select:{
                                            name:true,
                                            tariff:true
                                        }
                                    }
                                },
                                where:{
                                    package_status:{
                                        not:{
                                            equals:false
                                        }
                                    }
                                },
                            },
                        },
                    },
                }
            }
        }
    });

    const result = {
        id:solutionSheet.id,
        offering:[]
    }

    for (key in solutionSheet.sheet.offering){
        const offering = {
            package_name: solutionSheet.sheet.offering[key].offer_name,
            total_price : 0,
            feature:[]
        }
        for (key2 in solutionSheet.sheet.offering[key].offering_packages) {
            offering.total_price += solutionSheet.sheet.offering[key].offering_packages[key2].package.tariff
            offering.feature.push(solutionSheet.sheet.offering[key].offering_packages[key2].package.name)
        }
        result.offering.push(offering)
    }

    return result;
}

async function getSolutionPortofolioTariff(query_product_id) {
    const solutionSheet = await database.sso.findFirst({
        where: {
            product_id:query_product_id
        },
        select : {
            id: true,
            business_model: true,
            sheet:{
                select: {
                    offering:{
                        select: {
                            offer_name:true,
                            offering_packages:{
                                select:{
                                    package:{
                                        select:{
                                            category:true,
                                            bussines_model:true,
                                            tariff:true
                                        },    
                                    }
                                },
                                where:{
                                    package_status:{
                                        not:{
                                            equals:false
                                        }
                                    }
                                }, 
                            },
                        },
                    },
                }
            }
        }
    });


    const result = {
        id: solutionSheet.id,
        offering:[]
    }

    for (key in solutionSheet.sheet.offering){
        const offering = {
            offer_name: solutionSheet.sheet.offering[key].offer_name,
            total_price: 0,
            business_model:""
        }
        for(key2 in solutionSheet.sheet.offering[key].offering_packages){
            if (solutionSheet.sheet.offering[key].offering_packages[key2].package.category == "MAIN_FEATURES"){
                offering.business_model = solutionSheet.sheet.offering[key].offering_packages[key2].package.bussines_model;
            }
            offering.total_price += solutionSheet.sheet.offering[key].offering_packages[key2].package.tariff;
        }

        result.offering.push(offering);
    }
    return result;
}

module.exports = {
    getSolutionGTOMTariff,
    getSolutionPortofolioTariff
}