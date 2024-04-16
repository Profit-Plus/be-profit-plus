const { database } = require('../../helpers/utils/db/database');

function createPic(data) {
    return database.pic.create({
        data: data
    });
}

function findAllPics() {
    return database.pic.findMany();
}

function findPic(picId) {
    return database.pic.findUnique({
        where: { id: picId }
    });
}

function updatePic(picId, data) {
    return database.pic.update({
        where: {
            id: picId
        },
        data: data
    });
}

function deletePic(picId) {
    return database.pic.delete({
        where: {
            id: picId
        }
    });
}

module.exports =  {
    createPic,
    findAllPics,
    findPic,
    updatePic,
    deletePic
};

