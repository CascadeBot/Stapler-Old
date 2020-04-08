const { URLSearchParams } = require('url');
const { getDB } = require('../../setup/db');
const { login: loginConfig, patreon: patreonConfig } = require('../../helpers/config');
const { getHighestTier } = require('./tier');
const got = require('got');

const patreonOauthUrl = patreonConfig.auth_url;
const patreonOauthTokenUrl = patreonConfig.token_url;

function getLink() {
    const patreonUrl = new URL(patreonOauthUrl);
    const params = new URLSearchParams();
    params.set("response_type", "code");
    params.set("client_id", patreonConfig.client_id);
    params.set("redirect_uri", loginConfig.host_origin + "/patreon/link/cb");
    params.set("scope", "identity");
    patreonUrl.search = params;
    return patreonUrl.toString();
}

async function getTokens(code) {
    const response = await got.post(patreonOauthTokenUrl, {
        form: {
            code,
            client_id: patreonConfig.client_id,
            client_secret: patreonConfig.client_secret,
            grant_type: "authorization_code",
            redirect_uri: loginConfig.host_origin + "/patreon/link/cb"
        },
        responseType: 'json'
    })
    return response.body;
}

async function linkAccount(tokens, patreon_id, discordId) {
    let patron = await getDB().patrons.findOne(
        { _id: patreon_id }
    );
    if (!patron) {
        patron = {};
        patron.tiers = [];
    }
    const tier = getHighestTier(patron.tiers);
    await getDB().users.findOneAndUpdate(
        { _id: discordId },
        {
            $set: {
                'patreon.isLinkedPatreon': true,
                'patreon.access_token': tokens.access_token,
                'patreon.refresh_token': tokens.refresh_token,
                'patreon.id': patreon_id,
                'patreon.tier': tier
            }
        }
    );
    // TODO update guild supporters array (TRIGGER SUPPORTERS REFRESH)
}

async function unlinkAccount(tokens, patreon_id, discordId) {
    // TODO remove patreon link from user
    // TODO update guild supporters array (TRIGGER SUPPORTERS REFRESH)
}

module.exports = {
    getLink,
    getTokens,
    linkAccount,
    unlinkAccount
};
