/** @type {import('stylelint').Config} */
module.exports = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    // camelCase for classes in CSS modules, kebab-case for everything else
    'selector-class-pattern': '^([a-z][a-zA-Z0-9]+|^([a-z][a-z0-9]*)(-[a-z0-9]+)*$)$',
  },
};
