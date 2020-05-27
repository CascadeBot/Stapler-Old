const { makeGuildSettings } = require("../query/guildResolver");
const { Long } = require("mongodb");

const fields = {
    mentionPrefix: "core",
    deleteCommand: "core",
    useEmbedForMessages: "core"
}

function bodyBuilder(input) {
    const body = {};

    let i = 0;
    for (let key in input) {
      body[fields[key] + "." + key] = input[key]
      i++;
    }
    if (i < 1)
      return null;
    return {
        $set: body
    }
}

async function resolve(parent, { id, input }, { db }) {
  const updateBody = bodyBuilder(input);
  if (!updateBody)
    throw new Error("needupdatefield");
  const guild = await db.guilds.findOneAndUpdate(
    {
      _id: Long.fromString(id),
    },
    updateBody,
    { returnOriginal: false }
  );
  if (!guild.value) throw new Error("guildnotfound");
  return makeGuildSettings(guild.value);
}

module.exports = {
  resolve,
};
