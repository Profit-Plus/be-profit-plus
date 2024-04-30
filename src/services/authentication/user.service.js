/* Service layer for users database interaction */
const bcrypt = require('bcrypt');
const { database } =require('../../helpers/utils/db/database');

function findLoginCredentialsByEmail(email) {
    return database.login_credentials.findUnique({
        where: { email }
    });
}

function createloginCredentialsByEmailAndPassword(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    return database.login_credentials.create({  
        data: user
    });
}

function createNewUsers({unitsName, teamName, levelName, displayName, loginCredentialsId}) {
    return database.users.create({
        data: {
            units: {
                connect: {units_name: unitsName}
            },
            levels: {
                connect: {level_name: levelName}
            },
            teams: {
                connect: {team_name: teamName}
            },
            display_name: displayName,
            login_credentials: {
                connect: {login_credentials_id: loginCredentialsId}
            },
        }
    });
}

function findUserById(id) {
    return database.users.findUnique({
        where: { id }
    });
}

function findRoleByLoginCredentialId(loginCredentialsId) {
    return database.users.findUnique({
        where: {
            login_credentials_id: loginCredentialsId,
            login_credentials: {
              login_credentials_id: loginCredentialsId,
            }
          },
          select: {
            level_name: true,
            team_name: true,
            units_name: true,
          },
    });
}

module.exports = {
    findLoginCredentialsByEmail,
    createNewUsers,
    createloginCredentialsByEmailAndPassword,
    findUserById,
    findRoleByLoginCredentialId
};