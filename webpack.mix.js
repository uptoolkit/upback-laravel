const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.browserSync(process.env.MIX_DEBUG_URL || "loc.laravel-react.test");

mix.js('resources/js/app.js', 'public/js')
    .react()
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
    ])
    .less("resources/css/plugins/antd.less", "public/css/plugins", {
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                "primary-color": "#001aff",

            },
        },
    })
    .alias({
        '@': 'resources/js',
    });

if (mix.inProduction()) {
    mix.version();
}
