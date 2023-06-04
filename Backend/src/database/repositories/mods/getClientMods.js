const schema = require('../../schemas/mods');
const {modType} = require('../../schemas/modEnum')

async function getClientMods() {
  try {
    const mods = await schema.find({ type: modType.Client });
    return mods;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = getClientMods;
