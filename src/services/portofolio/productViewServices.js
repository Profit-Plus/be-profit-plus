const { database } = require('../../helpers/utils/db/database');

function addNewProduct(product) {
    return database.product.create({
        data: {
            product_name: product.product_name,
            product_description: product.product_description,
            product_year: product.product_year,
            product_features: product.product_features,
            product_evidence_dir: product.product_evidence_dir,
            product_evidence_tariff_dir: product.product_evidence_tariff_dir,
            product_logo_dir: product.product_logo_dir,
            product_playbook_dir: product.product_playbook_dir,
            product_profile_link: product.product_profile_link,
            product_website_label: product.product_website_label,
            taxonomy: {
                create: {
                    taxonomy_name: product.taxonomy_name
                }
            }
        }
    })
}

function addProductMainUse({product_name, main_use_name}) {
    return database.product_main_use.create({
        data: {
            product: {
                connect: {
                    product_name: product_name,
                }
            },
            main_use: {
                connect: {
                    main_use_name: main_use_name
                }
            }
        }
    });
}

function addNewMainUse(mainUse) {
    return database.main_use.create({
        data: mainUse
    })
}

function addNewProductService(productService) {
    return database.product_service.create({
        data: {
            product_service_name: productService.product_service_name,
            product_service_description: productService.product_service_description,
            product: {
                connect: {
                    product_name: productService.product_name
                }
            }
        }
    })
}

module.exports = {
    addNewProduct,
    addNewMainUse,
    addProductMainUse,
    addNewProductService,
    addNewTaxonomy,
    addNewUnit
}

