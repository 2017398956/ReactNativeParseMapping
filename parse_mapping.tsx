var sourceMap = require('source-map');
var fs = require('fs');
let file = '';
file = './index.android.bundle.map';
file = './index.ios.bundle.map';
// file = './index.js'

let logFile = './log.txt';

fs.readFile(file, 'utf8', async function (err, data) {
    if(err){
        console.log('parse error:', err);
    }else{
        console.log('data length:', data.length);
        var smc = await new sourceMap.SourceMapConsumer(data);
        let line = 0;
        let column = 0;
        const logData = fs.readFileSync(logFile, 'UTF-8');
        // split the contents by new line
        const lines = logData.split(/\r?\n/);
        // print all lines
        let index = 0;
        let mainBundleIndex = 0;
        let lineColumn = [];
        let result = {source:'', line: 0, column: 0, name: ''};
        lines.forEach( line => {
            index = line.indexOf('(address');
            mainBundleIndex = line.indexOf('main.jsbundle:');
            if( mainBundleIndex > 0){
                lineColumn = line.substring(mainBundleIndex + 14, line.length - 1).split(':');
                result = smc.originalPositionFor({
                    line: Number(lineColumn[0]),
                    column: Number(lineColumn[1])
                });
                console.log(line.substring(0, index), result.source, result.line + ':' + result.column, '\n');
            }else{
                console.log(line);
            }
        });
    }
});

// fs.readFile(file, 'utf8', async function (err, data) {
//     if(err){
//         console.log('parse error:', err);
//     }else{
//         console.log('data length:', data.length);
//         var smc = await new sourceMap.SourceMapConsumer(data);
//         console.log(smc.originalPositionFor({
//             line: 1,
//             column: 538589,
//             // name: 'updateConversations',
//         }));
//     }
// });