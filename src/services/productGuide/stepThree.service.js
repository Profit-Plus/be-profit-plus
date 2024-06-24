const { database } = require('../../helpers/utils/db/database');

/**
 * Service function to update some details of product and add new partnership gtm host detail of the product
 * @param {Request} product 
 * @returns async function to perform operation
 */
function addPartnershipGtmHost(product) {
    return database.$transaction([
        database.product.update({
            where: {
                product_name: product.productName
            },
            data: {
                product_gtm_host: product.productGtmHost
            }
        }),

        database.gtm_host_partnership.create({
            data: {
                product_name: product.productName,
                partnership_description: product.partnershipDescription
            }
        })
    ]);
}

/**
 * Service function to update some details of product and add new partnership gtm host detail of the product
 * @param {Request} productName 
 * @param {String} directory 
 * @returns async function to perform operation
 */
function updatePartnershipFileDir(productName, directory) {
    return database.gtm_host_partnership.update({
        where: {
            product_name: productName
        },
        data: {
            partnership_file_dir: directory
        }
    });
}

/**
 * Service function to update some details of product and add new IBL/OBL gtm host detail of the product
 * @param {Request} product 
 * @returns async function to perform operation
 */
function updateIblOblGtmHost(product) {
    return database.gtm_host_iblobl.create({
        data: {
            product_name: product.productName,
            ibl_scenario: product.iblScenario,
            obl_scenario: product.oblScenario
        }
    })
}

/**
 * Service function to update the location of the product
 * @param {Request} product 
 * @returns async function to perform operation
 */
function updateProductLocation(product) {
    return database.product.update({
        where: {
            product_name: product.productName
        },
        data: {
            product_location: product.productLocation
        }
    })
}

/**
 * Service function to add some suppliers of the product
 * @param {Request} suppliers 
 * @returns async function to perform operation
 */
function addProductSupplier(productName, supplier) {
    return database.product_supplier.createMany({
        data: {
            product_name: productName,
            supplier_name: supplier.supplierName
        }
    });
}

/**
 * Service function to add some business process of the product
 * @param {Request} businessProcess 
 * @returns async function to perform operation
 */
function addProductBusinessProcess(productName, businessProcess) {
    return database.product_business_model.createMany({
        data: {
            product_name: productName,
            business_model_name: businessProcess.modelName,
            business_model_nodes: businessProcess.modelNode
        }
    })
}

/**
 * Service function to add some internal information of the product
 * @param {Request} information 
 * @returns async function to perform operation
 */
function addInternalInformation(information) {
    return database.information_internal.createMany({
        data: information
    });
}

/**
 * Service function to add some external information of the product
 * @param {Request} information 
 * @returns async function to perform operation
 */
function addExternalInformation(information) {
    return database.information_external.createMany({
        data: information
    });
}

function addProductOrganizationHead(head) {
    return database.product_organization_head.create({
        data: {
            product_name: head.product_name,
            head_name: head.head_name
        }
    });
}

function addProductOrganizationNode(productName, node) {
    return database.product_organization_node.createMany({
        data: {
            product_name: productName,
            node_name: node.node_name
        }
    });
}

function addProductManagementSystem(productName, element) {
    return database.product_management_system.createMany({
        data: {
            product_name: productName,
            management_system_desc: element.element
        }
    });
}
 
/**
 *  Export functions to module
 */
module.exports = {
    addPartnershipGtmHost,
    updatePartnershipFileDir,
    updateIblOblGtmHost,
    updateProductLocation,
    addProductSupplier,
    addProductBusinessProcess,
    addInternalInformation,
    addExternalInformation,
    addProductOrganizationHead,
    addProductOrganizationNode,
    addProductManagementSystem
}