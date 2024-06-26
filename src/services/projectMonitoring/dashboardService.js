const { database } = require('../../helpers/utils/db/database');

async function fetchProjectSummary(params) {
    const [project, init, closeOut, prevProject, prevInit, prevCloseOut] = await database.$transaction([
        database.project.aggregate({
            _sum: {
                tariff: true
            },
            where: {
                created_at: {
                    gte: params.start_date,
                    lt: params.end_date
                },
                deleted_at: null
            }
        }),
        database.project_init.aggregate({
            _sum: {
                potential_revenue: true
            },
            where: {
                created_at: {
                    gte: params.start_date,
                    lt: params.end_date
                },
                deleted_at: null
            }
        }),
        database.project_close_out.aggregate({
            _sum: {
                employee_trained: true,
                revenue_in: true
            },
            where: {
                created_at: {
                    gte: params.start_date,
                    lt: params.end_date
                },
                deleted_at: null
            }
        }),
        database.project.aggregate({
            _sum: {
                tariff: true
            },
            where: {
                created_at: {
                    gte: params.start_date_compare,
                    lt: params.end_date_compare
                },
                deleted_at: null
            }
        }),
        database.project_init.aggregate({
            _sum: {
                potential_revenue: true
            },
            where: {
                created_at: {
                    gte: params.start_date_compare,
                    lt: params.end_date_compare
                },
                deleted_at: null
            }
        }),
        database.project_close_out.aggregate({
            _sum: {
                employee_trained: true,
                revenue_in: true
            },
            where: {
                created_at: {
                    gte: params.start_date_compare,
                    lt: params.end_date_compare
                },
                deleted_at: null
            }
        }),
    ]);

    const tariffChange = (project._sum.tariff - prevProject._sum.tariff) / prevProject._sum.tariff * 100;
    const potentialRevenueChange = (init._sum.potential_revenue - prevInit._sum.potential_revenue) / prevInit._sum.potential_revenue * 100;
    const employeeTrainedChange = (closeOut._sum.employee_trained - prevCloseOut._sum.employee_trained) / prevCloseOut._sum.employee_trained * 100;
    const revenueInChange = (closeOut._sum.revenue_in - prevCloseOut._sum.revenue_in) / prevCloseOut._sum.revenue_in * 100;

    return {
        tariff: {
            label: 'Tariff',
            tag: 'Q' + params.quarter,
            value: project._sum.tariff,
            change: tariffChange,
            direction: tariffChange != Infinity && tariffChange > 0 ? 'up' : 'down'
        },
        potential_revenue: {
            label: 'Potential Revenue',
            tag: 'Q' + params.quarter,
            value: init._sum.potential_revenue,
            change: potentialRevenueChange,
            direction: potentialRevenueChange != Infinity && potentialRevenueChange > 0 ? 'up' : 'down'
        },
        employee_trained: {
            label: 'Employee Trained',
            tag: 'Q' + params.quarter,
            value: closeOut._sum.employee_trained,
            change: employeeTrainedChange,
            direction: employeeTrainedChange != Infinity && employeeTrainedChange > 0 ? 'up' : 'down'
        },
        revenue_in: {
            label: 'Revenue In',
            tag: 'Q' + params.quarter,
            value: closeOut._sum.revenue_in,
            change: revenueInChange,
            direction: revenueInChange != Infinity && revenueInChange > 0 ? 'up' : 'down'
        },
    };
}

async function fetchProjectProgress(params) {
    const condition = {
        created_at: {
            gte: params.start_date,
            lt: params.end_date
        },
        deleted_at: null
    }

    const [init, ongoing, closeOut] = await database.$transaction([
        database.project.count({ where: { ...condition, status: 'initiation' } }),
        database.project.count({ where: { ...condition, status: 'ongoing' } }),
        database.project.count({ where: { ...condition, status: 'close_out' } })
    ]);

    return {
        tag: 'Q' + params.quarter,
        labels: ['Initiation & Planning', 'On Going', 'Close Out'],
        values: [init, ongoing, closeOut],
        colors: ['#1C244D', '#50A5B2', '#50A5B2']
    };
}

async function fetchProjectPartnership(params) {
    const condition = {
        created_at: {
            gte: params.start_date,
            lt: params.end_date
        },
        deleted_at: null
    }

    const [total, academy, business, government, community, techProv, subsidiary] = await database.$transaction([
        database.project_init.count({ where: condition }),
        database.project_init.count({ where: { ...condition, helix: 'academy' } }),
        database.project_init.count({ where: { ...condition, helix: 'business' } }),
        database.project_init.count({ where: { ...condition, helix: 'government' } }),
        database.project_init.count({ where: { ...condition, helix: 'community' } }),
        database.project_init.count({ where: { ...condition, helix: 'tech_prov' } }),
        database.project_init.count({ where: { ...condition, helix: 'subsidiary' } }),
    ]);
    
    let maxRange = Math.ceil(total / 100) * 100;
    let ranges = [0];
    let temp = 0;
    for (let i = 0; i < 4; i++) {
        temp += ((maxRange / 8) * 2)
        ranges.push(temp)
    }

    return {
        tag: 'Q' + params.quarter,
        total: total,
        ranges: ranges,        
        labels: ['Academy', 'Business', 'Community', 'Government', 'Tech', 'Subsidiary'],
        values: [academy, business, government, community, techProv, subsidiary],
        colors: ['#659B83', '#D7B251', '#50A5B2', '#652B87', '#3E6AAB', '#B33828']
    };
}

module.exports = {
    fetchProjectSummary,
    fetchProjectProgress,
    fetchProjectPartnership
}