const Encore = require('@symfony/webpack-encore');
const path = require("path");

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or subdirectory deploy
    //.setManifestKeyPrefix('build/')

    .addAliases({
        '@publicFolder': path.resolve(__dirname, './public'),
        '@commonFolder': path.resolve(__dirname, './assets/common/js'),
        '@commonComponents': path.resolve(__dirname, './assets/common/js/components'),
        '@commonFunctions': path.resolve(__dirname, './assets/common/js/functions'),
        '@appFolder': path.resolve(__dirname, './assets/app/js'),
        '@adminPages': path.resolve(__dirname, './assets/admin/js/pages/components'),
        '@nodeModulesFolder': path.resolve(__dirname, './node_modules'),
    })

    .copyFiles({
        from: './assets/admin/fonts',
        to: 'admin/fonts/[path][name].[ext]',
    })
    .copyFiles({
        from: './assets/admin/images',
        to: 'admin/images/[path][name].[ext]',
    })

    .configureFilenames({
        css: !Encore.isProduction() ? 'css/[name].css' : 'css/[name].[hash:8].css',
        js: !Encore.isProduction() ? 'js/[name].js' : 'js/[name].[hash:8].js'
    })

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('common_app', './assets/common/js/app.js')

    .addEntry('app_app', './assets/app/js/app.js')

    .addEntry('admin_app', './assets/admin/js/app.js')
    .addEntry('admin_homepage', './assets/admin/js/pages/homepage.js')
    .addEntry('admin_users', './assets/admin/js/pages/users.js')

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // enables Sass/SCSS support
    .enableSassLoader()
    .enablePostCssLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    .enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    .autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
