/* Service layer for users database interaction */
const bcrypt = require('bcrypt');
const { database } = require('../../helpers/configuration/db');

function findAccessCredentials(email) {
    return database.access_credentials.findUnique({
        where: { 
            email: email 
        },
        select: {
            access_credentials_id: true,
            password: true
        }
    });
}

function findAccessCredentialsById(id) {
    return database.access_credentials.findUnique({
        where: { 
            access_credentials_id: id 
        },
        omit: {
            password: true
        }
    });
}

function findAllSuperAdmin() {
    return database.access_credentials.findMany({
        where: { 
            users: {
                level_name: 'SUPERADMIN'
            }
        },
        omit: {            
            password: true
        }
    });
}

function createUserAccessCredentials(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    return database.access_credentials.create({
        data: {
            email: user.email,
            password: user.password,
            user_name: user.userName,
        }
    });
}

function createNewUsers(user, accessCredentials) {
    return database.users.create({
        data: {
            units: {
                connect: {units_name: user.unit}
            },
            levels: {
                connect: {level_name: user.level}
            },
            teams: {
                connect: {team_name: user.team}
            },
            access_credentials: {
                connect: {access_credentials_id: accessCredentials.access_credentials_id}
            },
        }
    });
}

function findUserById(id) {
    return database.users.findUnique({
        where: { id }
    });
}

function findUserPropertiesByAccessCredentialId(accessCredentialsId) {
    return database.users.findUnique({
        where: {
            access_credentials_id: accessCredentialsId,
            access_credentials: {
                access_credentials_id: accessCredentialsId,
            }
        },
        select: {
            level_name: true,
            team_name: true,
            units_name: true,
        },
    });
}

function addNewLevel(id, level) {
    return database.levels.create({
        data: {
            level_id: id,
            level_name: level.levelName
        }
    })
}

function addNewUnit(id, unit) {
    return database.units.create({
        data: {
            unit_id: id,
            units_name: unit.unitName
        }
    })
}

function addNewTeam(id, team) {
    return database.teams.create({
        data: {
            team_id: id,
            team_name: team.teamName
        }
    })
}

function checkUserValidation(userId) {
    return database.access_credentials.findUnique({
        where: {
            access_credentials_id: userId
        },
        select: {
            email: true
        }
    });
}

module.exports = {
    findAccessCredentials,
    findAccessCredentialsById,
    findAllSuperAdmin,
    createNewUsers,
    createUserAccessCredentials,
    findUserById,
    findUserPropertiesByAccessCredentialId,
    addNewLevel,
    addNewUnit,
    addNewTeam,
    checkUserValidation
};