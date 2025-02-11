const url = require('url')
const path = require('path')

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

module.exports = __dirname