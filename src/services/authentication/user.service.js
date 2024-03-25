/* Service layer for users database interaction */
const bcrypt = require('bcrypt');
const { database } =require('../../helpers/utils/db/database');

function findLoginCredentialsByEmail(email) {
    return database.loginCredentials.findUnique({
        where: { email }
    });
}

function createloginCredentialsByEmailAndPassword(user) {
    user.password = bcrypt.hashSync(user.password, 12);
    return database.loginCredentials.create({
        data: user
    });
}

function createNewUsers({unitsName, teamName, levelName, loginCredentialsId}) {
    return database.users.create({
        data: {
            units: {
                connect: {unitsName: unitsName}
            },
            levels: {
                connect: {levelName: levelName}
            },
            teams: {
                connect: {teamName: teamName}
            },
            loginCredentials: {
                connect: {loginCredentialsId: loginCredentialsId}
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
            loginCredentialsId: loginCredentialsId,
            loginCredentials: {
              loginCredentialsId: loginCredentialsId,
            },
          },
          select: {
            levelName: true,
            teamName: true,
            unitsName: true,
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