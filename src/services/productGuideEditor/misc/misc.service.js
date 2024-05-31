const { database } = require('../../../helpers/configuration/db');

/**
 *  @function addNewTaxonomy to add a new name of taxonomy
 */
function addNewTaxonomy(id, taxonomy) {
    return database.taxonomy.create({
        data: {
            taxonomy_uuid: id,
            taxonomy_name: taxonomy.name
        }
    })
}

/**
 *  @function getTaxonomyIdByName to get a taxonomy ID based on its name
 */
function getTaxonomyIdByName(name) {
    return database.taxonomy.findUnique({
        where: {
            taxonomy_name: name
        },
        select: {
            taxonomy_uuid: true
        }
    });
}

/**
 *  @function getUnitIDByName to get a unit ID based on its name
 */
function getUnitIDByName(name) {
    return database.units.findUnique({
        where: {
            units_name: name
        },
        select: {
            unit_id: true
        }
    });
}

module.exports = {
    addNewTaxonomy,
    getTaxonomyIdByName,
    getUnitIDByName
}