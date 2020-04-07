const { URLSearchParams } = require('url');
const { getDB } = require('../setup/db');
const { patreon: patreonConfig, login: loginConfig } = require('../helpers/config');
const got = require('got');
const crypto = require('crypto');

const patreonOauthUrl = patreonConfig.auth_url;
const patreonOauthTokenUrl = patreonConfig.token_url;
const ClientID = patreonConfig.client_id
const ClientSecret = patreonConfig.client_secret

const events = [
    "members:create",
    "members:update",
    "members:delete",
    "members:pledge:create",
    "members:pledge:update",
    "members:pledge:delete"
]

function getLink() {
    const patreonUrl = new URL(patreonOauthUrl);
    const params = new URLSearchParams();
    params.set("response_type", "code");
    params.set("client_id", ClientID);
    params.set("redirect_uri", loginConfig.host_origin + "/patreon/link/cb");
    params.set("scope", "identity");
    patreonUrl.search = params;
    return patreonUrl.toString();
}

async function getTokens(code) {
    const response = await got.post(patreonOauthTokenUrl, {
        form: {
            code,
            client_id: ClientID,
            client_secret: ClientSecret,
            grant_type: "authorization_code",
            redirect_uri: loginConfig.host_origin + "/patreon/link/cb"
        },
        responseType: 'json'
    })
    return response.body;
}

async function getIdentity(access_token) {
    const response = await got(patreonConfig.api_host + "/identity", {
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + access_token,
        }
    });
    return response.body;
}

async function linkAccount(tokens, patreon_id, discordId) {
    await getDB().users.findOneAndUpdate(
        { _id: discordId },
        {
            $set: {
                'patreon.isLinkedPatreon': true,
                'patreon.access_token': tokens.access_token,
                'patreon.refresh_token': tokens.refresh_token,
                'patreon.id': patreon_id
            }
        }
    );
}

function verifyWebhookSignature(signature, body) {
    const hmac = crypto.createHmac("md5", patreonConfig.webhook.secret);
    hmac.update(body);
    return hmac.digest("hex") === signature;
}

async function handleWebhookResponse(signature, event, rawdata, data) {
    if (!(event && signature && rawdata && data)) throw new Error("Missing params");
    if (!verifyWebhookSignature(signature, rawdata)) throw new Error("Signature invalid");
    if (!events.includes(event)) throw new Error("Event unsupported");
    if (!(data.relationships.currently_entitled_tiers.data &&
        data.relationships.user.data.id))
        throw new Error("Data structure invalid");
    console.log({
        event,
        patreon_id: data.relationships.user.data.id,
        email: data.attributes.email,
        donation_total: data.attributes.lifetime_support_cents,
        tiers: data.relationships.currently_entitled_tiers.data.map(({id}) => id)
    });
}

module.exports = {
    getLink,
    getTokens,
    linkAccount,
    getIdentity,
    handleWebhookResponse
};
