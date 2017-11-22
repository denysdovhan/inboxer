module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
        "node": true,
    },
    "rules": {
        "import/no-extraneous-dependencies": [2, { "devDependencies": true }]
    }
};