const fs = require('fs');

function validateAndCreatePaths(paths) {
    paths.forEach((filePath) => {
        if (!fs.existsSync(filePath)) {
            try {
                fs.mkdirSync(filePath, { recursive: true });
                console.log(`Created path: ${filePath}`);
            } catch (error) {
                console.error(`Error creating path: ${filePath}`);
            }
        } else {
            console.log(`Path already exists: ${filePath}`);
        }
    });
}

module.exports = validateAndCreatePaths
