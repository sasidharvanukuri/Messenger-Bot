`use strict`;


const glob = require('glob');
const path = require('path')
const models = glob.sync(path.join(__dirname, '../', 'models/*js'), null);
models.forEach(each=>{
    require(each)
})
