const _ = require("lodash");
const {OTS_APPLICATION} = require('../config');
const appOrm = require('../util/orm')(OTS_APPLICATION.name, OTS_APPLICATION.index);
const {prisma, getModel} = require('../util');

const getAppInfo = (result) => {
    if (!result) {
        return null;
    }
    if (_.isArray(result)) {
        result = _.first(result);
    }
    result.environment = _.isString(result.environment) ? result.environment : JSON.parse(result.environment);
    return result;
}


const otsModel = {
    async getAppById(id) {
        return await appOrm.findByPrimary([{id}]);
    },
    async getAppByProvider({userId, provider, providerRepoId}) {
        const application = await appOrm.findOne({
            user_id: userId,
            provider,
            provider_repo_id: providerRepoId,
        });
        return getAppInfo(application);
    },
    async createApp(params) {
        const {id, ...apps} = params;
        return await appOrm.create([{id}], apps);
    },
    async listAppByUserId(userId) {
        const applicationResult = await appOrm.findAll({
            user_id: userId,
            orderKeys: ['updated_time', 'created_time'],
        });
        return _.get(applicationResult, 'result', []);
    },
    async deleteAppById(appId) {
        const result = await appOrm.delete([{id: appId}]);
        return getAppInfo(result);
    },
    async updateAppById(id, params) {
        const result = await appOrm.update([{id}], params);
        return result;
    },
}

const prismaModel = {
    async getAppById(id) {
        const result = await prisma.application.findUnique({where: {id}});
        return getAppInfo(result);
    },
    async getAppByProvider({userId, provider, providerRepoId}) {
        const application = await prisma.application.findFirst({
            where: {
                user_id: userId,
                provider,
                provider_repo_id: providerRepoId,
            }
        });
        return getAppInfo(application);
    },
    async createApp(data) {
        return await prisma.application.create({
            data: {
                ...data,
                environment: JSON.stringify(data.environment)
            }
        })
    },
    async listAppByUserId(userId) {
        const applicationResult = await prisma.application.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                updated_time: "desc"
            }
        })
        return _.get(applicationResult, 'result', []);
    },
    async deleteAppById(appId) {
        const result = await prisma.application.delete({
            where: {id: appId}
        });
        return result;
    },
    async updateAppById(id, params) {
        const result = prisma.application.update({where: {id}, params})
        return result;
    },
}

module.exports = getModel(otsModel, prismaModel);
