const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    target: "web",
    output: {
        filename: "observable.bundle.js",
        path: path.resolve(__dirname, "bundle"),
        library: {
            type: "module",
        },
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        extensions: ['.ts'],
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
