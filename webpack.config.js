const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        filename: "fleuve.bundle.js",
        path: path.resolve(__dirname, "bundle"),
        library: {
            type: "module",
        },
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.bundle.json' })]
    },
    module: {
        rules: [
            {
                include: path.resolve(__dirname, "src"),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        }
                    },
                ]
            },
        ]
    },
};
