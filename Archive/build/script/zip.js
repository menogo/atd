const fs = require('fs-extra');
const archiver = require('archiver');
const { resolve } = require('path');

const cwd = process.cwd();

fs.removeSync(resolve(cwd, 'dist/test'));
fs.ensureDirSync(resolve(cwd, 'dist/test'));

const cdn = fs.createWriteStream(resolve(cwd, 'dist/test/cdn.zip'));
const ui = fs.createWriteStream(resolve(cwd, 'dist/test/ui.zip'));

const cdnZip = archiver('zip', { zlib: { level: 9 } });
const uiZip = archiver('zip', { zlib: { level: 9 } });

uiZip.glob(
    '**/**',
    {
        cwd: resolve(cwd, 'dist/ui'),
        ignore: ['**/.*']
    },
    { prefix: 'main' }
);

cdnZip.glob(
    '**/**',
    {
        cwd: resolve(cwd, 'dist/cdn'),
        ignore: ['**/.*']
    },
    { prefix: 'main' }
);

cdnZip.pipe(cdn);
uiZip.pipe(ui);

cdnZip.finalize();
uiZip.finalize();
