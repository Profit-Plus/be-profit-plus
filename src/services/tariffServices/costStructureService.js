const { Prisma } = require('@prisma/client');
const { database } = require('../../helpers/utils/db/database');

async function getCostStructure(sheetsId) {
    const [listPackage, costStructureData] = await database.$transaction([
      database.packages.findMany({
        select:{
          name: true,
          category: true,
          id: true,
        },
        where: {
          sheets_id: sheetsId
      }}),
      database.type.findMany({
        include: {
          categories: {
            select: {
              id: true,
              category: true,
              category_data: {
                select: {
                  data: {
                    select: {
                      id: true,
                      event_module: true,
                      unit: true,
                      average_price: true,
                      data_package: {
                        select: {
                          data_id: true,
                          package_id: true,
                          quantity: true,
                          frequency: true,
                          excess: true,
                          total: true,
                          information: true,
                          package: {
                            select: {
                              name: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          sheets_id: sheetsId
        },
      })
    ])
    return {listPackage, costStructureData}
}

async function getDetailList() {
    const detailList = await database.data.findMany(
      {select: {
        id: true,
        event_module: true,
        average_price: true,
        unit: true
      }}
    )
    return {detailList}
}
  

async function upsertCategory(sheetId, categoryData){
  const type = await database. type.findFirst({
    where:{
      sheets_id: sheetId,
      type: categoryData.type
    }
  });

  return await database.categories.upsert({
    where:{
      id: categoryData.id,
    },
    update:{
      category: categoryData.category,
      type_id: type.id
    },
    create:{
      category: categoryData.category,
      type_id: type.id
    }
  });
}

// async function createCategory(sheetId, newCategory){
//   const type_id = await database.type.findFirst({
//     where:{
//       sheets_id: sheetId,
//       type: newCategory.type
//     }
//   }) 
  
//   return await database.categories.create({
//         data: {
//             type_id: type_id,
//             category: newCategory.category
//         }
//     });
// }
  
// async function updateCategory(sheetId, newCategory){
//     const type_id = await database.type.findFirst({
//       where:{
//         sheets_id: sheetId,
//         type: newCategory.type
//       }
//     }) 
//     return await database.categories.update({
//       where: {
//         id: newCategory.id
//       },
//       data: {
//         type_id: type_id,
//         category: newCategory.category
//       }
//     });
// }

async function deleteCategory(categoryId){
    return await database.categories.delete({
      where: {
        id: categoryId
      }
    });
}

async function deleteRow(data){
  const [categoryData, dataPackage] = await database.$transaction([
    database.data_package.deleteMany({
      where: {
        data_id: data.dataId
      }
    }),
     database.category_data.delete({
      where:{
        data_id_category_id:{
          category_id: data.categoryId,
          data_id: data.dataId
        }
      }
    })
  ]);

  const checkCategory = await database.category_data.findMany({
    where: {
      category_id: data.categoryId
    }
  });

  if (checkCategory.length > 0) {
    return {categoryData, dataPackage}
  } else {
      await database.categories.delete({
        where:{
        id: data.categoryId
        }
      })
  }
  return {categoryData, dataPackage}

}
  
async function connectData(sheetId, connect) {
    // Find all packages related to the given productId
    const packageList = await database.packages.findMany({
      select: {
        id: true,
      },
      where: {
        sheets_id: sheetId,
      },
    });
    
    for (const pkg of packageList) {
      await database.data_package.upsert({
          where:{
            data_id_package_id:{
              package_id: pkg.id,
              data_id: connect.oldDataId
            }
          },
          update:{
            data_id: connect.newDataId
          },
          create:{
              package_id: pkg.id,
              data_id: connect.newDataId,
              quantity: 0,
              frequency: 0,
              excess: 1,
              total: 0,
              information: '-',  
          }
        })
    }
    
    await database.category_data.upsert({
      where:{
        data_id_category_id:{
          category_id: connect.categoryId,
          data_id: connect.oldDataId
        }
      },
      update:{
        data_id: connect.newDataId
      },
      create:{
        category_id: connect.categoryId,
        data_id: connect.newDataId
      }
    });

    const data = await database.data.findMany({
      where:{
        id: connect.newDataId
      }
    });
    return {data};
}
  
async function createPackage(sheetId, packageData){
    const newPackage = await database.packages.create({
      data: {
        sheets_id: sheetId,
        name: packageData.name,
        category: packageData.category
      }
    });
  
    const getDataId = await database.sheets.findUnique({
      where: { id: sheetId },
      select: {
        types: {
          select: {
            categories: {
              select: {
                category_data: {
                  select: {
                    data_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    const dataIds = getDataId.types.flatMap(types =>
      types.categories.flatMap(category =>
        category.category_data.map(categoryData => categoryData.data_id)
      )
    );

    if (!(dataIds.length === 0)){
      const dataPackages = dataIds.map(dataId => ({
        package_id: newPackage.id,
        data_id: dataId,
        quantity: 0,
        frequency: 0,
        excess: 1,
        total: 0,
        information: '-'
      }));
  
      await database.data_package.createMany({
        data: dataPackages
      });
    }
  
    const getTypeId = await database.type.findMany({
      select:{
        id: true
      },
      where: { 
        sheets_id: sheetId 
      }
    });
  
    for (const type of getTypeId){
      await database.total.createMany({
        data: {
          type_id: type.id,
          package_id: newPackage.id,
          total: 0
        }
      })
    }

    const getOfferings = await database.offering.findMany({
      select:{
        id: true
      },
      where: { 
        sheets_id: sheetId 
      }
    });
  
    for (const offering of getOfferings){
      await database.offering_package.createMany({
        data: {
          offering_id: offering.id,
          package_id: newPackage.id,
        }
      })
    }

    return newPackage;
}
  
async function updatePackage(packageData){
    return await database.packages.update({
      where:{
        id: packageData.id
      },
      data:{
        name: packageData.name,
        category: packageData.category
      }
    })
}
  
async function updateDataPackage(dataPackage){
  return await database.data_package.update({
    where:{
      data_id_package_id:{
        data_id: dataPackage.dataId,
        package_id: dataPackage.packageId
      }
    },
    data:{
      quantity: dataPackage.quantity,
      frequency: dataPackage.frequency,
      excess: dataPackage.excess,
      total: dataPackage.total,
      information: dataPackage.information
    }
  })
}

async function deletePackage(packageId){
    return await database.packages.delete({
      where:{
        id: packageId
      }
    })
}
  
async function updateTotal(sheetId, total){
    const type = await database. type.findFirst({
      where:{
        sheets_id: sheetId,
        type: total.type
      }
    });

    await database.total.update({
      where:{
        package_id_type_id:{
          package_id: total.packageId,
          type_id: type.id
        }
      },
      data:{
        total: total.total
      }
    })
}
  
module.exports = {
    getCostStructure,
    getDetailList,
    upsertCategory,
    // createCategory, 
    deleteCategory,
    deleteRow,
    // updateCategory,
    connectData,
    createPackage,
    updatePackage,
    updateDataPackage,
    deletePackage,
    updateTotal
};
  