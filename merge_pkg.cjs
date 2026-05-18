const fs = require('fs');
const oldPkg = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
const newPkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const excludes = ['react', 'react-dom', 'react-router', 'react-router-dom'];

newPkg.dependencies = newPkg.dependencies || {};
for (const [key, value] of Object.entries(oldPkg.dependencies)) {
    if (!excludes.includes(key)) {
        newPkg.dependencies[key] = value;
    }
}

newPkg.devDependencies['tailwindcss'] = oldPkg.devDependencies['tailwindcss'];
newPkg.devDependencies['@tailwindcss/vite'] = oldPkg.devDependencies['@tailwindcss/vite'];

fs.writeFileSync('./package.json', JSON.stringify(newPkg, null, 2));
console.log('Merged package.json successfully.');
