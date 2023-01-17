const router = require("express").Router();
const _ = require("lodash");
const {Result, ValidationError, NoPermissionError} = require('../../util');
const accountModel = require('../../model/account.mode');

router.post("/loginout", async function (req, res, next) {
    req.userId = null;
    res.cookie('jwt', '', {httpOnly: true});
    return res.json(Result.ofSuccess());
});

router.post("/orgInfo", async function (req, res, next) {
    
});

router.post("/userInfo", async function (req, res, next) {
    const result = await accountModel.getUserById(req.userId);
    if(!result.id) {
        throw new NoPermissionError("用户信息异常");
    }
    const third_part = _.get(result, 'third_part', {});
    const userInfo = !(_.isEmpty(result)) ? {
        ...(_.omit(result, ['third_part', 'password', 'secrets'])),
        isAuth: !!(_.get(third_part, 'github.access_token', false)),
        github_name: _.get(third_part, 'github.owner', '')
    } : {};
    return res.json(Result.ofSuccess(userInfo));
});

router.post("/updateUserProviderToken", async function (req, res, next) {
    const data = await accountModel.getUserById(req.userId);
    const third_part = _.get(data, "third_part", "");
    const github = _.get(third_part, "github", {});
    const body = _.get(req.body, 'data', {});
    await accountModel.updateUserById(req.userId, {
        third_part: {
            ...third_part,
            github: {
                ...github,
                access_token: body.token,
            },
        }
    });
    return res.json(Result.ofSuccess());
});

router.post('/addOrCompileSecrets', async function (req, res) {
    const {data: {secrets, isAdd}} = req.body;
    const {secrets: currentSecrets = {}} = await accountModel.getUserById(req.userId);
    await accountModel.updateUserById(req.userId,
        {
            secrets: JSON.stringify(isAdd ? _.assign(currentSecrets, secrets) : secrets || {})
        }
    )
    return res.json(Result.ofSuccess());
})

router.get('/globalSecrets', async function (req, res, next) {
    const result = await accountModel.getUserById(req.userId);
    if (_.isEmpty(result)) {
        throw new ValidationError('当前用户信息不存在');
    }
    const params = {secrets: _.get(result, 'secrets', {})}
    return res.json(Result.ofSuccess(params));
})

module.exports = router;
