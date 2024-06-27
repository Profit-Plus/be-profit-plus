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

function getOperatingModelDetails(operatingModelId) {
    return database.product_operating_model.findFirst({
        where: {
            product_operating_model_uuid: operatingModelId
        },
        select: {
            product_location: true,
            product_op_gtm_host: {
                select: {
                    product_gtm_host_uuid: true,
                    host_option: true,
                    host_description: true,
                    host_file_dir: true
                }
            },
            product_op_supplier: {
                select: {
                    product_op_supplier_uuid: true,
                    product_supplier_description: true
                }
            },
            product_op_business_process_header: {
                select: {
                    product_op_business_process_header_uuid: true,
                    header_description: true,
                    product_op_business_process_nodes: {
                        select: {
                            product_op_business_process_nodes_uuid: true,
                            node_description: true
                        }
                    }
                }
            },
            product_op_information_internal: {
                select: {
                    product_op_information_internal_uuid: true,
                    information_description: true
                }
            },
            product_op_information_external: {
                select: {
                    product_op_information_external_uuid: true,
                    information_description: true
                }
            },
            product_op_organization_header: {
                select: {
                    product_op_organization_header_uuid: true,
                    header_description: true,
                    product_op_organization_nodes: {
                        select: {
                            product_op_organization_nodes_uuid: true,
                            node_description: true
                        }
                    }
                }
            },
            product_op_management_systems: {
                select: {
                    product_op_management_systems_uuid: true,
                    management_system_description: true
                }
            }
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

function deleteOpSupplier(supplierId) {
    return database.product_op_supplier.delete({
        where: {
            product_op_supplier_uuid: supplierId
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

function deleteOpBusinessProcessHeader(headerId) {
    return database.product_op_business_process_header.delete({
        where: {
            product_op_business_process_header_uuid: headerId
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

function deleteOpBusinessProcessNode(nodeId) {
    return database.product_op_business_process_nodes.delete({
        where: {
            product_op_business_process_nodes_uuid: nodeId
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

function deleteInternalInformation(internalInformationId) {
    return database.product_op_information_internal.delete({
        where: {
            product_op_information_internal_uuid: internalInformationId
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

function deleteExternalInformation(externalInformationId) {
    return database.product_op_information_external.delete({
        where: {
            product_op_information_external_uuid: externalInformationId
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

function deleteOpOrganizationNodes(nodeId) {
    return database.product_op_organization_nodes.delete({
        where: {
            product_op_organization_nodes_uuid: nodeId
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

function deleteManagementSystems(managementSystemId) {
    return database.product_op_management_systems.delete({
        where: {
            product_op_management_systems_uuid: managementSystemId
        }
    });
}

module.exports = {
    updateOperatingModeLocation,
    getOperatingModelDetails,
    addOpGtomHost,
    getOpGtomHost,
    addOpSupplier,
    addOpBusinessProcessHeader,
    addOpBusinessProcessNode,
    addOpOrganizationHeader,
    addOpOrganizationNodes,
    addInternalInformation,
    addExternalInformation,
    addManagementSystems,
    deleteOpSupplier,
    deleteOpBusinessProcessHeader,
    deleteOpBusinessProcessNode,
    deleteInternalInformation,
    deleteExternalInformation,
    deleteOpOrganizationNodes,
    deleteManagementSystems
}