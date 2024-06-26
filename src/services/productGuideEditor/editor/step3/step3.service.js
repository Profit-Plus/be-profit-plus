const { database } = require('../../../../helpers/configuration/db');

/**
 *  @function updateOperatingModeLocation to update the location of product's operating model
 */
function updateOperatingModeLocation(operatingModelId, location) {
    return database.product_operating_model.update({
        where: {
            product_operating_model_uuid: operatingModelId
        },
        data: {
            product_location: location
        }
    });
}

/**
 *  @function addGtomHost to add the details of GTOM Host based on its host option 
 */
function addOpGtomHost(operatingModelId, data) {
    return database.product_op_gtm_host.update({
        where: {
            product_operating_model_uuid: operatingModelId
        },
        data: {
            host_option: data.host,
            host_description: data.description,
            host_file_dir: data.fileDir
        }
    });
}

function getOpGtomHost(operatingModelId) {
    return database.product_op_gtm_host.findFirst({
        where: {
            product_operating_model_uuid: operatingModelId
        }
    });
}

/**
 *  @function addOpSupplier to add suppliers in product's operating model 
 */
function addOpSupplier(id, operatingModelId, data) {
    return database.product_op_supplier.create({
        data: {
            product_op_supplier_uuid: id,
            product_operating_model_uuid: operatingModelId,
            product_supplier_description: data.description
        }
    });
}

/**
 *  @function addOpBusinessProcessHeader to add business process header in product's operating model 
 */
function addOpBusinessProcessHeader(id, operatingModelId, head) {
    return database.product_op_business_process_header.create({
        data: {
            product_op_business_process_header_uuid: id,
            product_operating_model_uuid: operatingModelId,
            header_description: head
        }
    });
}

/**
 *  @function addOpBusinessProcessNode to add business process node in product's operating model 
 */
function addOpBusinessProcessNode(id, headerId, node) {
    return database.product_op_business_process_nodes.create({
        data: {
            product_op_business_process_nodes_uuid: id,
            product_op_business_process_header_uuid: headerId,
            node_description: node
        }
    });
}

/**
 *  @function addInternalInformation to add internal information of a product's operating model
 */
function addInternalInformation(id, operatingModelId, information) {
    return database.product_op_information_internal.create({
        data: {
            product_op_information_internal_uuid: id,
            product_operating_model_uuid: operatingModelId,
            information_description: information.description
        }
    });
}

/**
 *  @function addExternalInformation to add external information of a product's operating model
 */
function addExternalInformation(id, operatingModelId, information) {
    return database.product_op_information_external.create({
        data: {
            product_op_information_external_uuid: id,
            product_operating_model_uuid: operatingModelId,
            information_description: information.description
        }
    });
}

/**
 *  @function addOpOrganizationHeader to add organization head in product's operating model 
 */
function addOpOrganizationHeader(id, operatingModelId, head) {
    return database.product_op_organization_header.update({
        where: {
            product_operating_model_uuid: operatingModelId,
        },
        data: {
            product_op_organization_header_uuid: id,
            header_description: head
        }
    });
}

/**
 *  @function addOpOrganizationNodes to add organization node in product's operating model 
 */
function addOpOrganizationNodes(id, headerId, node) {
    return database.product_op_organization_nodes.create({
        data: {
            product_op_organization_nodes_uuid: id,
            product_op_organization_header_uuid: headerId,
            node_description: node
        }
    });
}

/**
 *  @function addManagementSystems to add a new management system data to product's operating model
 */
function addManagementSystems(id, operatingModelId, managementSystem) {
    return database.product_op_management_systems.create({
        data: {
            product_op_management_systems_uuid: id,
            product_operating_model_uuid: operatingModelId,
            management_system_description: managementSystem.description
        }
    });
}

module.exports = {
    updateOperatingModeLocation,
    addOpGtomHost,
    getOpGtomHost,
    addOpSupplier,
    addOpBusinessProcessHeader,
    addOpBusinessProcessNode,
    addOpOrganizationHeader,
    addOpOrganizationNodes,
    addInternalInformation,
    addExternalInformation,
    addManagementSystems
}