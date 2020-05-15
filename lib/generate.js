const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const exists = require('fs').existsSync
const path = require('path')
const rm = require('rimraf').sync
const ora = require('ora')

const complete = require('./complete')

const spinner = ora()

// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b
    ? opts.inverse(this)
    : opts.fn(this)
})

module.exports = function generate (name, src, dest, answers) {
  spinner.start('Generating template ...')
  if (exists(dest)) rm(dest)
  Metalsmith(path.join(src, 'template'))
    .metadata(answers)
    .clean(false)
    .source('.')
    .destination(dest)
    .use((files, metalsmith, done) => {
      const metadata = metalsmith.metadata()
      const keys = Object.keys(files)
      keys.forEach(fileName => {
        const str = files[fileName].contents.toString()
        if (!/{{([^{}]+)}}/g.test(str)) {
          return
        }
        files[fileName].contents = Buffer.from(Handlebars.compile(str)(metadata))
      })
      done()
    })
    .build((err, files) => {
      if (err) {
        spinner.fail(`Faild to generate template: ${err.message.trim()}`)
      } else {
        new Promise((resolve, reject) => {
          setTimeout(() => {
            spinner.succeed('Successful generated template!')
            resolve()
          }, 3000)
        }).then(() => {
          const data = {...answers, ...{
            destDirName: name,
            inPlace: dest === process.cwd()
          }}
          complete(data)
        })
      }
    })
}