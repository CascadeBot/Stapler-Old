const got = require('got');
const { patreon: patreonConfig } = require('../../helpers/config');

async function getIdentity(access_token) {
   const response = await got(patreonConfig.api_host + "/identity", {
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    });
    return response.body;
}

module.exports = {
    getIdentity
};
