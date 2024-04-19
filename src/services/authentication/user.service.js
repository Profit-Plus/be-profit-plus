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
        data: {
            email: user.email,
            password: user.password,
            user_name: user.userName,
        }
    });
}

function createNewUsers(user, loginCredentials) {
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
            login_credentials: {
                connect: {login_credentials_id: loginCredentials.login_credentials_id}
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