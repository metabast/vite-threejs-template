module.exports = {
    extends: [
        'plugin:vue/vue3-recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true
        }
    },
    env: {
        'browser': true
    },
    rules: {
        'max-len': 'off',
        'no-shadow': 'off',
        'import/no-cycle': 'off',
        'vue/no-v-html': 'off',
        'sort-imports': [ 'error', {
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            allowSeparatedGroups: true,
        }],
        indent: [
            'error',
            4
        ],
        quotes: [
            'error',
            'single'
        ]
    }
}