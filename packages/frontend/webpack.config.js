const path = require('path');
const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
    const isProduction = env.production === true;
    const envPath = isProduction ? '.env.production' : '.env.development';
    const envParsed = dotenv.config({ path: envPath }).parsed || {};

    // Asegurarse de que NODE_ENV esté definido
    const nodeEnv = isProduction ? 'production' : 'development';
    console.log(`Webpack: Configurando entorno como ${nodeEnv}`);

    const envKeys = Object.keys(envParsed).reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(envParsed[key]);
        return acc;
    }, {});

    // Añadir NODE_ENV explícitamente
    envKeys['process.env.NODE_ENV'] = JSON.stringify(nodeEnv);

    console.log(envKeys);

    return {
        mode: nodeEnv,
        entry: `${path.resolve(__dirname, 'src')}/index.tsx`,
        watch: !isProduction,
        watchOptions: !isProduction ? {
            ignored: /node_modules/,
            poll: 1000,
        } : undefined,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
            publicPath: '/',
            clean: true,
        },
        devtool: isProduction ? 'source-map' : 'inline-source-map',
        devServer: !isProduction ? {
            host: '0.0.0.0',
            port: 3000,
            allowedHosts: 'all',
            compress: true,
            hot: true,
            liveReload: true,
            historyApiFallback: true,
            static: {
                directory: path.resolve(__dirname, 'public'),
                watch: true,
            },
            client: {
                webSocketURL: "auto://0.0.0.0:0/ws",
                overlay: true,
            },
            watchFiles: {
                paths: [
                    `${path.resolve(__dirname, 'src')}/**/*`,
                    `${path.resolve(__dirname, 'src')}/infrastructure/i18n/locales/*.json`,
                    `${path.resolve(__dirname, 'redux')}/**/*`
                ],
                options: {
                    usePolling: true,
                    interval: 2000,
                },
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        } : undefined,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.s?[ac]ss$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                // Excluir node_modules del procesamiento con sass-loader
                                additionalData: (content, loaderContext) => {
                                    if (loaderContext.resourcePath.includes('node_modules')) {
                                        return content;
                                    }
                                    return content;
                                }
                            }
                        }
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/images/[contenthash][ext][query]',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/fonts/[contenthash][ext][query]',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '@domain': path.resolve(__dirname, 'src/domain'),
                '@application': path.resolve(__dirname, 'src/application'),
                '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
                '@ui': path.resolve(__dirname, 'src/ui'),
                '@shared': path.resolve(__dirname, 'src/shared'),
                '@i18n': path.resolve(__dirname, 'src/infrastructure/i18n'),
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public/index.html'),
                inject: true,
                favicon: path.resolve(__dirname, 'public/assets/favicon.png'),
            }),
            new CopyPlugin({
                patterns: [
                    { from: 'public/assets', to: 'assets', noErrorOnMissing: true }
                ]
            }),
            new DefinePlugin(envKeys),
            ...(isProduction && env.analyze ? [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: true,
                })
            ] : []),
            isProduction && new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
            }),
        ],
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: isProduction,
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                        name: 'react-vendor',
                        chunks: 'all',
                    },
                    redux: {
                        test: /[\\/]node_modules[\\/](@reduxjs|react-redux)[\\/]/,
                        name: 'redux-vendor',
                        chunks: 'all',
                    },
                    i18n: {
                        test: /[\\/]node_modules[\\/](i18next|react-i18next)[\\/]/,
                        name: 'i18n-vendor',
                        chunks: 'all',
                    },
                },
            },
            runtimeChunk: {
                name: 'runtime',
            },
        },
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
    };
};