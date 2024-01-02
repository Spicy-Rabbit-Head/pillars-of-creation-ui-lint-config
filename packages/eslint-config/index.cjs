// 配置标准的eslint规则
const configStandard = require('eslint-config-standard/.eslintrc.json')
/**
 * eslint规则的等效规则
 * 用于将数组中的规则设定为统一的值
 * @type {string[]} eslint规则的等效规则
 */
const equivalents = [
    // 强制执行一致的缩进
    'indent',
    // 不允许声明未使用的变量
    'no-unused-vars',
    // 禁止重新声明变量
    'no-redeclare',
    // 禁止在变量声明之前使用它们
    'no-use-before-define',
    // 规定大括号的样式,例如在控制流语句或函数中
    'brace-style',
    // 控制对象或数组字面量中是否允许额外的逗号
    'comma-dangle',
    // 大括号内强制保持一致的间距
    'object-curly-spacing',
    // 强制语句末尾使用分号
    'semi',
    // 控制字符串使用单引号还是双引号
    'quotes',
    // 在块之前强制执行一致的间距
    'space-before-blocks',
    // 在定义左括号之前强制执行一致的间距function
    'space-before-function-paren',
    // 需要在中缀运算符周围留出间距
    'space-infix-ops',
    // 在关键字前后强制使用一致的间距
    'keyword-spacing',
    // 在逗号前后强制使用一致的间距
    'comma-spacing',
    // 不允许不必要的括号
    'no-extra-parens',
    // 禁止重复的类成员
    'no-dupe-class-members',
    // 禁止使用失去精度的文字数字
    'no-loss-of-precision',
    // 要求或不允许在类成员之间使用空行
    'lines-between-class-members',
    // 要求或不允许函数标识符及其调用之间的间距
    'func-call-spacing',
    // 禁止构造函数Array
    'no-array-constructor',
    // 禁止未使用的表达式
    'no-unused-expressions',
    // 禁止不必要的构造函数
    'no-useless-constructor'
]

/**
 * 将可迭代对象转换为对象
 * @param iterable 要转换的可迭代对象
 * @return {*} 从可迭代对象生成的对象
 */
function fromEntries(iterable) {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
    }, {})
}

/**
 * 从提供的 ESLint 标准配置对象中检索规则
 * @param name 要检索的规则名称
 * @return {*|string} 规则的配置,如果未找到,则返回 'off'
 */
function ruleFromStandard(name) {
    const rule = configStandard.rules[name]

    return rule || 'off'
}

/**
 * TypeScript规则
 * @type {{[p: string]: *}} TypeScript规则
 */
const typeScriptRules = {
    // 控制台规则配置,根据环境变量决定是否启用 console
    'no-console':
        process.env.NODE_ENV === 'production' ?
            // 在生产环境中,只允许 warn 和 error
            ['error', {allow: ['warn', 'error']}]
            // 在开发环境中,使用所有 console
            : 'off',
    // debugger 规则配置,根据环境变量决定是否启用 debugger
    // 在生产环境中,只允许 error,在开发环境中,关闭此规则
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // 禁止在语句中使用赋值运算符return
    'no-return-assign': 'off',
    // 禁止使用可变的导出
    'import/no-mutable-exports': 'error',
    // 导入顺序规则配置
    'import/order': [
        // 启用规则,不符合规则的导入将被视为错误
        'error',
        {
            // 要遵守的顺序
            groups: [
                // 所有不匹配其他组的导入先导入
                'unknown',
                // 内部模块、外部模块、内部定义的模块、父目录中的模块、当前目录的index、当前目录的其他模块、不匹配上述任何一种情况的模块
                ['builtin', 'external', 'internal', 'parent', 'index', 'sibling', 'object'],
                // 自定义的模块分组标识
                'type'
            ],
            // 匹配文件路径模式的数组
            pathGroups: [
                {
                    // 下面匹配到的文件路径,分为 unknown
                    pattern: '**/*.{css,scss,sass,less,styl,stylus,json,xml}',
                    group: 'unknown',
                    position: 'before'
                },
                {
                    // 匹配到的 node 模块,分为 builtin
                    pattern: '{node:*,node:**/*}',
                    group: 'builtin',
                    position: 'before'
                },
                {
                    // 匹配到的 vue 模块,分为 external
                    pattern: '{vitest,vue,vue-router,pinia,vuex,vue-i18n,axios,@vue/*}',
                    group: 'external',
                    position: 'before'
                }
            ],
            // 排除匹配文件路径模式的数组
            pathGroupsExcludedImportTypes: ['unknown', 'type'],
            // 在分组之间是否应该插入空行以及在组内部是否需要空行
            'newlines-between': 'always-and-inside-groups',
            // 是否对未赋值的导入语句发出警告
            warnOnUnassignedImports: false
        }
    ],
    // 模块内强制执行排序的导入声明
    'sort-imports': [
        // 启用规则,不符合规则的导入将被视为错误
        'error',
        {
            // 忽略大小写
            ignoreCase: false,
            // 忽略声明的成员数量
            ignoreDeclarationSort: true,
            // 忽略成员导入声明中的成员排序
            ignoreMemberSort: false,
            // 成员语法排序顺序定义
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            // 检查出现在连续行上的导入声明语句的排序
            allowSeparatedGroups: false
        }
    ],
    // 循环设定为关闭
    ...fromEntries(equivalents.map(name => [name, 'off'])),
    // 从标准配置中检索规则,并将其转换为等效的 TypeScript 规则
    // 没有等效的规则将被关闭
    ...fromEntries(equivalents.map(name => [`@typescript-eslint/${name}`, ruleFromStandard(name)])),
    // 强制使用一致的缩进
    '@typescript-eslint/indent': [
        // 启用规则,不符合规则的导入将被视为错误
        'error',
        // 缩进的数量
        2,
        {
            // switch 语句中的 case 子句缩进
            SwitchCase: 1,
            // 对象字面量中的属性缩进
            VariableDeclarator: 1,
            // 文件级 IIFE 强制执行缩进级别
            outerIIFEBody: 1,
            // 强制执行多行属性链的缩进
            MemberExpression: 1,
            // 函数强制执行缩进级别
            FunctionDeclaration: {parameters: 1, body: 1},
            // 函数表达式强制执行缩进级别
            FunctionExpression: {parameters: 1, body: 1},
            // 函数调用表达式强制执行缩进级别
            CallExpression: {arguments: 1},
            // 数组中的元素强制执行缩进
            ArrayExpression: 1,
            // 强制对象中属性的缩进
            ObjectExpression: 1,
            // 强制执行 import 语句的缩进
            ImportDeclaration: 1,
            // 嵌套在其他三元表达式中的三元表达式不需要缩进
            flatTernaryExpressions: false,
            // 忽略代码中的注释
            ignoreComments: false,
            // 禁用任何 AST 节点的缩进检查的数组
            ignoredNodes: [
                // 所有的模板字面量节点
                'TemplateLiteral *',
                // JSX 元素节点
                'JSXElement',
                // JSX 元素节点下的所有子节点
                'JSXElement > *',
                // JSX 属性节点
                'JSXAttribute',
                // JSX 中的标识符
                'JSXIdentifier',
                // JSX 中的命名空间名称
                'JSXNamespacedName',
                // JSX 中的成员表达式
                'JSXMemberExpression',
                // JSX 中的扩展属性
                'JSXSpreadAttribute',
                // JSX 表达式容器
                'JSXExpressionContainer',
                // JSX 开始标签
                'JSXOpeningElement',
                // JSX 结束标签
                'JSXClosingElement',
                // JSX 片段
                'JSXFragment',
                // JSX 片段的开始标签
                'JSXOpeningFragment',
                // JSX 片段的结束标签
                'JSXClosingFragment',
                // JSX 文本
                'JSXText',
                // JSX 空表达式
                'JSXEmptyExpression',
                // JSX 扩展子节点
                'JSXSpreadChild',
                // TypeScript 类型参数实例化
                'TSTypeParameterInstantiation',
                // 具有装饰器的函数表达式的参数节点,选择函数表达式的参数,装饰器的长度大于0
                'FunctionExpression > .params[decorators.length > 0]',
                // 函数表达式参数中的装饰器,但不包括第一个参数
                'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
                // 具有装饰器的类成员属性的键节点
                'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
            ],
            // 三元表达式的值进行缩进
            offsetTernaryExpressions: true
        }
    ],
    // 禁止使用any类型
    '@typescript-eslint/no-explicit-any': 'off',
    // 禁止使用不必要的布尔值转换
    '@typescript-eslint/strict-boolean-expressions': 'off',
    // 在函数括号前强制使用一致的间距
    '@typescript-eslint/space-before-function-paren': [
        'error',
        {
            // 匿名函数前需要有空格
            anonymous: 'always',
            // 命名函数前不允许有空格
            named: 'never',
            // 异步箭头函数前需要有空格
            asyncArrow: 'always'
        }
    ],
    // 禁止在变量定义前使用（但允许在函数定义前使用）
    '@typescript-eslint/no-use-before-define': [
        'error',
        {
            // 允许在函数定义前使用
            functions: false,
            // 允许在类定义前使用
            classes: false,
            // 在变量定义前禁止使用
            variables: true,
            // 允许在枚举定义前使用
            enums: false,
            // 允许在类型定义前使用
            typedefs: false
        }
    ],
    // 要求接口和类型文本具有特定的成员分隔符样式
    '@typescript-eslint/member-delimiter-style': [
        'error',
        {
            // 多行
            multiline: {
                // 多行时使用逗号分隔
                delimiter: 'comma',
                // 不要求最后一个成员有逗号
                requireLast: false
            },
            // 单行
            singleline: {
                // 单行时使用逗号分隔
                delimiter: 'comma',
                // 不要求最后一个成员有逗号
                requireLast: false
            }
        }
    ],
    // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    '@typescript-eslint/no-inferrable-types': 'error',
    // 禁止使用this别名
    '@typescript-eslint/no-this-alias': [
        'error',
        {
            // 允许使用解构赋值的情况下使用this别名
            allowDestructuring: true
        }
    ],
    // 关闭不允许类型始终为 true 或始终为 false 的条件警告
    '@typescript-eslint/no-unnecessary-condition': 'off',
    // 关闭要求在导出的函数和类的公共类方法上显式返回和参数类型的警告
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 关闭要求函数和类方法具有显式返回类型的警告
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 关闭禁止使用 postfix 运算符进行非 null 断言的警告
    '@typescript-eslint/no-non-null-assertion': 'off',
    // 关闭强制一致地使用类型断言的警告
    '@typescript-eslint/consistent-type-assertions': 'off',
    // 强制一致的类型导入方式
    '@typescript-eslint/consistent-type-imports': [
        'error',
        {
            // 优先使用类型导入
            prefer: 'type-imports',
            // 允许类型注解
            disallowTypeAnnotations: false
        }
    ],
    // 关闭禁止特定注释的警告
    '@typescript-eslint/ban-ts-comment': 'off',
    // 关闭数组类型的警告
    '@typescript-eslint/array-type': 'off',
    // 未使用变量的警告
    '@typescript-eslint/no-unused-vars': [
        'warn',
        {
            // 在使用之后警告
            args: 'after-used',
            // 忽略以_开头的参数
            argsIgnorePattern: '^_',
            // 不检查捕获的错误
            caughtErrors: 'none',
            // 忽略解构剩余的兄弟项
            ignoreRestSiblings: true
        }
    ],
    '@typescript-eslint/lines-between-class-members': 'off'
}

// 导出eslint配置
module.exports = ({
    // 使用的扩展
    extends: [
        // 使用 eslint 的标准规则
        'standard',
        // 使用 JSX 的标准规则
        'standard-jsx',
        // 使用 JSONC 推荐的规则
        'plugin:jsonc/recommended-with-jsonc',
        // 使用 YAML 的标准规则
        'plugin:yml/standard',
        // 使用 Markdown 的推荐规则
        'plugin:markdown/recommended',
        // 使用 Vue3 的推荐规则
        'plugin:vue/vue3-recommended',
        // 使用 Vue TypeScript 的推荐规则
        '@vue/eslint-config-typescript/recommended'
    ],
    // 指定代码的环境
    env: {
        // 启用ES6语法支持
        es6: true,
        // 启用浏览器环境支持
        browser: true,
        // 启用Node.js环境支持
        node: true
    },
    // 指定解析器 使用Vue的ESLint解析器
    parser: 'vue-eslint-parser',
    // 指定解析器选项
    parserOptions: {
        // 使用最新的ECMAScript版本
        ecmaVersion: 'latest'
    },
    // 指定插件
    plugins: [
        // 启用React插件
        'react'
    ],
    // 报告未使用的禁用指令
    reportUnusedDisableDirectives: true,
    // 配置导入解析器
    settings: {
        // 配置导入解析器
        'import/resolver': {
            // 使用node解析器
            node: {
                // 配置扩展名
                extensions: ['.mts', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.node']
            }
        }
    },
    // 指定规则
    rules: {
        // 导入自定义规则
        ...typeScriptRules,
        // 强制使用严格相等（===或!==）来比较Vue中的数据
        'vue/eqeqeq': 'error',
        // 在大括号内强制执行一致的间距<template>
        'vue/object-curly-spacing': ['error', 'always'],
        // 要求Vue组件直接导出对象，而不是直接导出一个函数或类
        'vue/require-direct-export': 'error',
        // 禁止解析错误<template>
        'vue/no-parsing-error': [
            'error',
            {
                // 关闭有关尚未打开的元素的结束标记的错误
                'x-invalid-end-tag': false
            }
        ],
        // 强制执行每行的最大属性数
        'vue/max-attributes-per-line': [
            'warn',
            {
                // 单行最多3个属性
                singleline: 3,
                // 多行最多1个属性
                multiline: 1
            }
        ],
        // 强制要求组件名称属性与其文件名匹配
        'vue/match-component-file-name': [
            'error',
            {
                // 要验证的文件扩展名数组
                extensions: ['vue'],
                // 指示组件的名称是否也应与其文件名大小写匹配
                shouldMatchCase: false
            }
        ],
        // 要求 <template> 中的中缀运算符周围有空格
        'vue/space-infix-ops': [
            'error',
            {
                // 在Vue模板中，禁止要求操作符与它们的操作数有空格分开，不需要给32位整型提示
                int32Hint: false
            }
        ],
        // 强制执行自关闭样式
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    // 要求HTML空元素（如 <img />）总是自我关闭
                    void: 'always',
                    // 要求常规HTML元素（如 <div>）从不自我关闭
                    normal: 'never',
                    // 要求组件标签从不自我关闭
                    component: 'never'
                },
                // 要求SVG元素总是自我关闭
                svg: 'always',
                // 要求MathML元素总是自我关闭
                math: 'always'
            }
        ],
        // 关闭禁止使用保留的Vue组件名称
        'vue/no-reserved-component-names': 'off',
        // 关闭注释指令的验证
        'vue/comment-directive': 'off',
        // 关闭多词组件名称的验证
        'vue/multi-word-component-names': 'off',
        // 关闭禁止在setup函数中对props进行解构的验证
        'vue/no-setup-props-destructure': 'off',
        // 关闭要求默认的prop验证
        'vue/require-default-prop': 'off',
        // 强制在Vue模板的块之间添加空行
        'vue/padding-line-between-blocks': ['error', 'always']
    },
    // ESLint 规则覆盖设置
    overrides: [
        {
            // 针对vue
            files: ['*.vue'],
            // 覆盖规则
            rules: {
                // 针对 Vue 文件的覆盖设置，否则 TypeScript 规则将不会生效
                // 导入自定义规则
                ...typeScriptRules,
                // 关闭未使用变量的警告
                'no-unused-vars': 'off',
                // 不允许使用未声明的变量
                'no-undef': 'off',
                // 关闭未使用 TypeScript 变量的警告
                '@typescript-eslint/no-unused-vars': 'off',
                // 关闭要求一致的类型导入的警告
                '@typescript-eslint/consistent-type-imports': 'off'
            }
        },
        {
            // 针对jsx,tsx,vue
            files: ['*.jsx', '*.tsx', '*.vue'],
            // 覆盖规则
            rules: {
                // 关闭逗号操作符警告
                'no-sequences': 'off',
                // 关闭自关闭组件警告
                'react/self-closing-comp': 'off',
                // 关闭检查 JSX 中的 key
                'react/jsx-key': 'off',
                // 检查 JSX 中大括号的存在
                'react/jsx-curly-brace-presence': [
                    'error',
                    {
                        // 强制要求属性中的大括号
                        props: 'always',
                        // 强制要求子元素中的大括号
                        children: 'always',
                        // 强制要求属性元素中的值为大括号
                        propElementValues: 'always'
                    }
                ],
                // 强制要求 JSX 元素使用帕斯卡命名
                'react/jsx-pascal-case': [
                    'error',
                    {
                        // 允许全部大写的组件名
                        allowAllCaps: true
                    }
                ],
                // 关闭 JSX 结束标签位置的警告
                'react/jsx-closing-tag-location': 'off',
                // 关闭 children 属性的警告
                'react/no-children-prop': 'off'
            }
        },
        {
            // 针对 TypeScript 声明文件
            files: ['*.d.ts'],
            // 覆盖规则
            rules: {
                // 关闭空接口的警告
                '@typescript-eslint/no-empty-interface': 'off',
                // 关闭一致的类型导入的警告
                '@typescript-eslint/consistent-type-imports': 'off',
                // 关闭未使用变量的警告
                '@typescript-eslint/no-unused-vars': 'off'
            }
        },
        {
            // 针对 JSON,JSON5
            files: ['*.json', '*.json5'],
            // 使用 JSON 解析器
            parser: 'jsonc-eslint-parser',
            rules: {
                // 数组括号间的空格设置为 never
                'jsonc/array-bracket-spacing': ['error', 'never'],
                // 逗号末尾的设置为 never
                'jsonc/comma-dangle': ['error', 'never'],
                // 逗号风格设置为 last
                'jsonc/comma-style': ['error', 'last'],
                // 缩进设置为 2
                'jsonc/indent': ['error', 2],
                // 键的前后空格设置
                'jsonc/key-spacing': ['error', {beforeColon: false, afterColon: true}],
                // 禁止八进制转义
                'jsonc/no-octal-escape': 'error',
                // 对象花括号换行设置
                'jsonc/object-curly-newline': ['error', {multiline: true, consistent: true}],
                // 对象花括号空格设置
                'jsonc/object-curly-spacing': ['error', 'always'],
                // 对象属性换行设置
                'jsonc/object-property-newline': ['error', {allowMultiplePropertiesPerLine: true}]
            }
        },
        {
            files: ['*.yaml', '*.yml'],
            // 使用 YAML 解析器
            parser: 'yaml-eslint-parser',
            rules: {
                // 关闭空格注释的警告
                'spaced-comment': 'off'
            }
        },
        {
            // markdown 文件中的代码块
            files: ['**/*.md/*.*'],
            rules: {
                // 关闭重新声明的警告
                '@typescript-eslint/no-redeclare': 'off',
                // 关闭未使用变量的警告
                '@typescript-eslint/no-unused-vars': 'off',
                // 关闭定义前使用变量的警告
                '@typescript-eslint/no-use-before-define': 'off',
                // 关闭使用 require 的警告
                '@typescript-eslint/no-var-requires': 'off',
                // 关闭逗号末尾的警告
                '@typescript-eslint/comma-dangle': 'off',
                // 关闭无法解析的导入的警告
                'import/no-unresolved': 'off',
                // 关闭警告对 alert 的使用
                'no-alert': 'off',
                // 关闭警告对 console 的使用
                'no-console': 'off',
                // 关闭受限制的导入的警告
                'no-restricted-imports': 'off',
                // 关闭未定义变量的警告
                'no-undef': 'off',
                // 关闭未使用表达式的警告
                'no-unused-expressions': 'off',
                // 关闭未使用变量的警告
                'no-unused-vars': 'off'
            }
        }
    ],
    // 指定了哪些文件或目录应该被 ESLint 忽略，不进行代码检查
    ignorePatterns: [
        '*.min.*',
        '*.log',
        '*.svg',
        '.env.*',
        'CHANGELOG.md',
        'dist',
        'LICENSE*',
        'output',
        'coverage',
        'public',
        'temp',
        'node_modules',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        '__snapshots__',
        '.husky',
        '!.github',
        '!.vitepress',
        '!.vscode'
    ]
})
