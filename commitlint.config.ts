const commitlintConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2, 
            'always', 
            ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']],
        'scope-enum': [
            2, 
            'always', 
            ['user', 'order', 'product', 'payment', 'shipment', 'refund', 'coupon', 'inventory', 'report', 'setting']],
        'subject-case': [0, 'never'],
    },
}

export default commitlintConfig
