const schema = require('../../schemas/resources');
const {resourceType} = require('../../schemas/resourcesEnum')

async function getClientMods() {
  try {
    const mods = await schema.find({ type: resourceType.Client });
    return mods;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = getClientMods;
