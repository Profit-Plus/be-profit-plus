import { database } from '../../helpers/utils/db/database';

function createPic(pic) {
    return database.pic.create({
        data: pic
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

function updatePic(pic) {
    return database.pic.update({
        where: {
            id: pic.id
        },
        data: pic
    });
}

function deletePic(picId) {
    return database.pic.delete({
        where: {
            id: picId
        }
    });
}

module.exports = {
    createPic,
    findAllPics,
    findPic,
    updatePic,
    deletePic
};

