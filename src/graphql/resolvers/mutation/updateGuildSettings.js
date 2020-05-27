const { makeGuildSettings } = require("../query/guildResolver");
const { Long } = require("mongodb");

const fields = {
  mentionPrefix: { namespace: "core" },
  deleteCommand: { namespace: "core" },
  useEmbedForMessages: { namespace: "core" },
  prefix: {
    namespace: "core",
    validate: (val) => {
      if (val.length == 0) throw new Error("Prefix invalid");
      return val; // TODO improve validation
    },
  },
};

function bodyBuilder(input) {
  const body = {};

  let i = 0;
  for (let key in input) {
    if (fields[key] == null) continue;

    let val = input[key];
    if (fields[key].validate) val = fields[key].validate(val);
    body[fields[key].namespace + "." + key] = val;
    i++;
  }
  if (i < 1) return null;
  return {
    $set: body,
  };
}

async function resolve(parent, { id, input }, { db }) {
  const updateBody = bodyBuilder(input);
  if (!updateBody) throw new Error("needupdatefield");
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
