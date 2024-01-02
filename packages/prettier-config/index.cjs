module.exports = {
    // 每行代码的最大长度限制为 100
    printWidth: 100,
    // 尽可能地省略箭头函数的参数括号
    arrowParens: 'avoid',
    // 在对象字面量的括号之间添加空格
    bracketSpacing: true,
    // 使用 LF 作为行尾分隔符
    endOfLine: 'lf',
    // 对象字面量的大括号不放在同一行
    bracketSameLine: false,
    // 仅在必要时为对象属性添加引号
    quoteProps: 'as-needed',
    // 不使用分号作为语句的结束符
    semi: false,
    // 使用单引号而不是双引号
    singleQuote: true,
    // 使用 2 个空格作为一个制表符的宽度
    tabWidth: 2,
    // 不在数组或对象最后一个元素或属性后面添加尾随逗号
    trailingComma: 'none',
    // 使用空格而不是制表符缩进
    useTabs: false,
    // Vue 文件中的 <script> 和 <style> 标签不进行特殊缩进
    vueIndentScriptAndStyle: false,
    // 在 JSX 中使用单引号
    jsxSingleQuote: true,
    overrides: [
        {
            // 匹配所有的 Markdown 文件
            files: '*.md',
            options: {
                // 关闭嵌入式语言（如代码块）的格式化
                embeddedLanguageFormatting: 'off'
            }
        }
    ]
}
