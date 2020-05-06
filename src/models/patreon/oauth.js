const { URLSearchParams } = require('url');
const { getDB } = require('../../setup/db');
const { Long } = require('mongodb');
const { login: loginConfig, patreon: patreonConfig } = require('../../helpers/config');
const { tierEnum } = require('./tier');
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
    const user = await getDB().users.findOneAndUpdate(
        { _id: Long.fromString(discordId) },
        {
            $set: {
                'patreon.isLinkedPatreon': true,
                'patreon.access_token': tokens.access_token,
                'patreon.refresh_token': tokens.refresh_token,
                'patreon.id': patreon_id,
                'patreon.tier': tierEnum.default
            }
        }
    );
    if (!user)
        throw new Error("Failed linking");
    const resp = await got.post(`${patreonConfig.service_url}/user/${discordId}/link/${patreon_id}`, {
        responseType: 'json',
        resolveBodyOnly: true,
        headers: {
            "Authorization": "Bearer " + patreonConfig.service_apikey
        }
    });
    if (!resp.success)
        throw new Error("Failed linking");
}

async function unlinkAccount(discordId) {
    const user = await getDB().users.findOneAndUpdate(
        { _id: Long.fromString(discordId) },
        {
            $set: {
                'patreon.isLinkedPatreon': false
            },
            $unset: {
                'patreon.access_token': "",
                'patreon.refresh_token': "",
                'patreon.id': "",
            }
        }
    );
    if (!user)
        throw new Error("Failed linking");
    const resp = await got.post(`${patreonConfig.service_url}/user/${discordId}/unlink`, {
        responseType: 'json',
        resolveBodyOnly: true,
        headers: {
            "Authorization": "Bearer " + patreonConfig.service_apikey
        }
    });
    if (!resp.success)
        throw new Error("Failed linking");
}

module.exports = {
    getLink,
    getTokens,
    linkAccount,
    unlinkAccount
};
