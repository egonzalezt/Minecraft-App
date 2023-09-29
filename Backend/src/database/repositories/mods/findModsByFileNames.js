const schema = require('../../schemas/resources');

/**
 * @param {string[]} fileNames
 * @returns {Promise<Object>}
 */
async function findModsByFileNames(fileNames) {
  const query = { fileName: { $in: fileNames } };
  const modDocs = await schema.find(query).select('fileName').lean();

  const results = {};
  for (const modDoc of modDocs) {
    results[modDoc.fileName] = true;
  }

  for (const fileName of fileNames) {
    if (!results.hasOwnProperty(fileName)) {
      results[fileName] = false;
    }
  }

  return results;
}

module.exports = findModsByFileNames;
