const spawn = require('child_process').spawn
const chalk = require('chalk')
const path = require('path')

module.exports = function complete(data) {
  const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)
  if (data.git) {
    initGit(cwd).then(() => {
      if (data.autoInstall) {
        installDependencies(cwd, data.autoInstall).then(() => {
          printMessage(data)
        }).catch(e => {
          console.log(chalk.red('Error:'), e)
        })
      } else {
        printMessage(data)
      }
    }).catch(e => {
      console.log(chalk.red('Error:'), e)
    })
  } else if (data.autoInstall) {
    installDependencies(cwd, data.autoInstall).then(() => {
      printMessage(data)
    }).catch(e => {
      console.log(chalk.red('Error:'), e)
    })
  } else {
    printMessage(data)
  }
}

function initGit (cwd, executable = 'git') {
  return runCommand(executable, ['init'], {
    cwd,
  })
}

function installDependencies(cwd, executable = 'npm') {
  console.log(`\n# ${chalk.green('Installing project dependencies ...')}`)
  console.log('# ========================\n')
  return runCommand(executable, ['install'], {
    cwd,
  })
}

function runCommand(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const spwan = spawn(
      cmd,
      args,
      Object.assign(
        {
          cwd: process.cwd(),
          stdio: 'inherit',
          shell: true,
        },
        options
      )
    )

    spwan.on('exit', () => {
      resolve()
    })
  })
}

function printMessage(data) {
  const message = `
# ${chalk.green('Project initialization finished!')}
# ========================

To get started:

  ${chalk.yellow(
    `${data.inPlace ? '' : `cd ${data.destDirName}\n  `}${installMsg(data)}npm run serve`
  )}
`
  console.log(message)
}

function installMsg(data) {
  return !data.autoInstall ? 'npm install\n  ' : ''
}