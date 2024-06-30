const fs = require('fs');

const packageJson = require('./package.json');
packageJson._moduleAliases = {
    "@": process.env.NODE_ENV === 'production' ? "dist" : "src"
}

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
