const { database } = require('../../helpers/utils/db/database');


async function createData(event_module, nature, pic, description, source, unit, code, grade, category_id) {
    return database.data.create({
      data: {
        event_module, 
        nature, 
        pic, 
        description,
        source, 
        unit, 
        code,  
        grade, 
        category_id
      },
    });
}
  
async function getAllData() {
    return database.data.findMany();
}

async function getDataById(id) {
    console.log(id + " prisma")
    return database.data.findUnique({
      where: {
        id,
      },
    });
}
  
async function updateData(id, event_module, nature, pic, description, source, unit, code, grade, category_id) {
    return database.data.update({
        where: { id },
        data: {
            event_module, 
            nature, 
            pic, 
            description,
            source, 
            unit, 
            code,  
            grade, 
            category_id
        },
    });
}
  
async function deleteData(id) {
    return database.data.delete({
        where: { id },
    });
}
  
async function createComponent(name, item, unit, specs, priceperunit, quantity, data_id) {
    return database.components.create({
      data: {
        name,
        item,
        unit,
        specs,
        priceperunit,
        quantity,
        data_id,
      },
    });
  }
  
async function getAllComponents() {
    return database.components.findMany();
}


async function getComponentById(id) {
    return database.components.findUnique({
        where: { id },
    });
}

async function updateComponent(id, name, item, unit, specs, priceperunit, quantity, data_id) {
    return database.components.update({
        where: { id },
        data: {
        name,
        item,
        unit,
        specs,
        priceperunit,
        quantity,
        data_id,
        },
    });
}

async function deleteComponent(id) {
    return database.components.delete({
        where: { id },
    });
}
  
module.exports = {
    createData,
    getAllData,
    getDataById,
    updateData,
    deleteData,
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
};