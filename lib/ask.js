const { prompt } = require('inquirer')

const questions = [{
  name: 'name',
  type: 'string',
  required: true,
  message: 'Project name'
}, {
  name: 'description',
  type: 'string',
  required: false,
  message: 'Project description'
}, {
  name: 'author',
  type: 'string',
  message: 'Author',
}, {
  name: 'git',
  type: 'confirm',
  message: 'Use git to initialize the local repository？',
}, {
  name: 'UI',
  type: 'list',
  message: 'Pick a UI library to install',
  choices: [{
    name: 'Element UI',
    value: 'element-ui',
    short: 'Element'
  }, {
    name: 'View Design',
    value: 'view-design',
    short: 'View'
  }, {
    name: 'Ant Design',
    value: 'ant-design-vue',
    short: 'Ant'
  }]
}, {
  name: 'import',
  type: 'list',
  message: 'Pick an import way',
  choices: [{
    name: 'Full import',
    value: 'full',
    short: 'Full'
  }, {
    name: 'On demand',
    value: 'demand',
    short: 'Demand'
  }],
  when: function (answers) {
    return answers.UI
  }
}, {
  name: 'eslint',
  type: 'list',
  message: 'Pick an eslint extends',
  choices: [{
    name: 'recommended',
    value: 'recommended',
    short: 'recommended'
  }, {
    name: 'strongly-recommended',
    value: 'strongly-recommended',
    short: 'strongly-recommended'
  }, {
    name: 'essential',
    value: 'essential',
    short: 'essential'
  }],
},{
  name: 'autoInstall',
  type: 'list',
  message: 'Should we run `npm install` for you after the project has been created? (recommended)',
  choices: [{
    name: 'Yes, use NPM',
    value: 'Npm',
    short: 'Npm'
  }, {
    name: 'No, I will handle that myself',
    value: false,
    short: 'no'
  }]
}]

const component = {
  'element-ui': {
    menu: 'el-menu',
    menuItem: 'el-menu-item',
    subMenu: 'el-submenu',
    css: 'element-ui/lib/theme-chalk/index.css',
    alias: 'ElementUI'
  },
  'view-design': {
    menu: 'Menu',
    menuItem: 'MenuItem',
    subMenu: 'Submenu',
    css: 'view-design/dist/styles/iview.css',
    alias: 'ViewUI'
  },
  'ant-design-vue': {
    menu: 'a-menu',
    menuItem: 'a-menu-item',
    subMenu: 'a-sub-menu',
    css: 'ant-design-vue/dist/antd.css',
    alias: 'Antd'
  }
}

module.exports = function ask () {
  return prompt(questions).then(answers => {
    return {...answers, ...component[answers.UI]}
  })
}

