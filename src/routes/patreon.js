const express = require("express");
const router = express.Router();
const Patreon = require('../models/patreon');
const { isAuthenticated } = require('../helpers/discord');
const bodyParser = require("body-parser");
const getRaw = bodyParser.json({
    verify: (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    }
});

router.get('/link', isAuthenticated, (req, res) => {
    res.redirect(Patreon.getLink());
});

router.get('/unlink', isAuthenticated, async (req, res) => {
    await Patreon.unlinkAccount(req.user._id.toString());
    res.redirect('/graphql'); // redirect to ui
});

router.get('/link/cb', isAuthenticated, async (req, res) => {
    const {code} = req.query;
    if (!code)
        return res.redirect(Patreon.getLink()); // TODO: Redirect to ui
    let tokens;
    let patreonUser;
    try {
        tokens = await Patreon.getTokens(code);
        patreonUser = await Patreon.getIdentity(tokens.access_token);
        await Patreon.linkAccount(tokens, patreonUser.data.id, req.user._id.toString());
    } catch (e) {
        console.error(e); // temp
        return res.redirect(Patreon.getLink()); // TODO: Redirect to ui
    }
    return res.redirect('/graphql'); // redirect to ui
});

module.exports = router;
