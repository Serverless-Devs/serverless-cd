const router = require('express').Router();
const webhook = require('./webhook');
const {lodash: _} = require('@serverless-cd/core');
const {Result, unionid, ValidationError} = require('../../util');
const {OTS_TASK} = require('../../config');
const taskOrm = require('../../util/orm')(OTS_TASK.name, OTS_TASK.index);
const userModel = require('../../model/account.mode');
const appModel = require('../../model/application.mode');

const getApplicationConfig = (applicationList) => {
    const omitList = ['webhook_secret'];
    if (_.isArray(applicationList)) {
        const result = _.map(applicationList, (item) => _.omit(item, omitList));
        return result;
    } else {
        return _.omit(applicationList, omitList);
    }
};

router.post('/create', async function (req, res, next) {
    const {repo, owner, repo_url, provider_repo_id, description, provider, environment} = req.body;
    const userId = req.userId;

    const userInfo = await userModel.getUserById(userId);
    const token = _.get(userInfo, `third_part.${provider}.access_token`, false);

    if (!token) {
        throw new ValidationError(`${provider} 授权 token 不存在，请重新授权`);
    }

    const application = await appModel.getAppByProvider({
        userId,
        provider,
        providerRepoId: provider_repo_id,
    });
    if (!_.isEmpty(application)) {
        throw new ValidationError('代码仓库已绑定，请勿重新绑定');
    }

    const appId = unionid();
    const webHookSecret = unionid();
    await webhook.add(owner, repo, token, webHookSecret, appId);
    const appInfo = await appModel.createApp({
        id: appId,
        user_id: userId,
        provider,
        provider_repo_id,
        repo_name: repo,
        owner,
        description,
        repo_url,
        environment,
        webhook_secret: webHookSecret,
    });
    return res.json(Result.ofSuccess({id: appId}));
});

router.get('/list', async function (req, res, next) {
    const userId = req.userId;
    const applicationList = await appModel.listAppByUserId(userId);
    res.json(Result.ofSuccess(getApplicationConfig(applicationList)));
});

router.get('/detail', async function (req, res, next) {
    const {id} = req.query;
    const applicationResult = await appModel.getAppById(id);

    if (_.isEmpty(applicationResult)) {
        throw new ValidationError('暂无应用信息');
    }

    res.json(Result.ofSuccess(getApplicationConfig(applicationResult)));
});

router.delete('/delete', async function (req, res) {
    const {appId} = req.query;
    const userId = req.userId;
    const app = await appModel.getAppById(appId);
    if (_.isEmpty(app)) {
        throw new ValidationError('没有找到此应用');
    }

    const taskResult = await taskOrm.findAll({user_id: userId, app_id: appId});
    const taskList = _.get(taskResult, 'result', []);
    if (!_.isEmpty(taskList)) {
        const primaryKeys = _.map(taskList, ({id}) => [{id}]);
        await taskOrm.batchDelete(primaryKeys);
    }
    await appModel.deleteAppById(appId);
    // 尝试删除应用的 webhook
    const {owner, repo_name, trigger_spec, provider} = app;
    const token = _.get(trigger_spec, `${provider}.secret`);
    await webhook.remove(owner, repo_name, token, appId);
    res.json(Result.ofSuccess({message: '删除应用成功'}));
});

router.post('/update', async function (req, res) {
    const {appId, secrets, environment} = req.body;
    const app = await appModel.getAppById(appId);
    if (_.isEmpty(app)) {
        throw new ValidationError('没有找到此应用');
    }
    const params = {environment};
    await appModel.updateAppById(app.id, params);
    res.json(Result.ofSuccess());
});

module.exports = router;
