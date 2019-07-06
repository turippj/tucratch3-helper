module.exports = {
    entry: './ui/app.js',
    mode: 'development',
    target: 'electron-renderer',
    output: {
        path: `${__dirname}/ui`,
        filename: 'renderer.js',
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
};