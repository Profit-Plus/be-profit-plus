const { database } = require('../../helpers/configuration/db');

/**
 *  @function addNewSolution to add a new solution formulation name
 */
function addNewSolution(id, name) {
    return database.solution_formulation.create({
        data: {
            solution_formulation_uuid: id,
            solution_name: name
        }
    })
}

module.exports = {
    addNewSolution
}