const path = require('path')
const fs = require('fs')
const got = require('got').default
const ProxyAgent = require('proxy-agent')

const httpsProxy = process.env.https_proxy || process.env.HTTPS_PROXY || ''

const options = {
  agent: {
    ...(httpsProxy ? { https: new ProxyAgent(httpsProxy) } : {})
  }
}

function download (url, target) {
  return new Promise((resolve, reject) => {
    const stream = got.stream(url, options)

    stream.on('error', (err) => {
      reject(err)
    })
    
    fs.mkdirSync(path.dirname(target), { recursive: true })
    stream.pipe(fs.createWriteStream(target + '.tmp'))
      .on('error', (err) => {
        reject(err)
      })
      .on('close', () => {
        fs.renameSync(target + '.tmp', target)
        resolve()
      })
  })
}

const idioms = path.join(__dirname, '../src/data/idioms.json')
got.get('https://raw.githubusercontent.com/antfu/handle/main/src/data/idioms.txt', options).then((res) => {
  fs.writeFileSync(idioms, `${JSON.stringify(res.body.split('\n'), null, 2)}\n`, 'utf8')
})
download('https://raw.githubusercontent.com/antfu/handle/main/src/data/polyphones.json', path.join(__dirname, '../src/data/polyphones.json'))
