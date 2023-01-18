module.exports = {
  printWidth: 100, // 一行代码的最大字符数
  tabWidth: 2, // tab宽度为2空格
  semi: true, // 结尾是否添加分号
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 尾部逗号设置，es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况
  arrowParens: 'always', // 箭头函数单个参数的情况是否省略括号，默认always是总是带括号
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
};
