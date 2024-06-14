const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function addNewUseCase to add a new use case of a product 
 */
function addNewUseCase(id, productId, useCase) {
    return database.product_use_case.create({
        data: {
            use_case_uuid: id,
            product_uuid: productId,
            company_name: useCase.companyName,
            company_description: useCase.companyDesc,
            company_logo_dir: useCase.companyLogoDir,
            product_for_company_description: useCase.productForCompanyDesc,
            use_case_description: useCase.useCaseDesc,
            use_case_features: useCase.features
        }
    });
}

module.exports = {
    addNewUseCase
}