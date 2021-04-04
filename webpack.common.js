const path = require('path');

module.exports = {
    entry: {
		  app: './src/ts/app.ts'
    },
    output: {
        filename: './build/rpg_wizard.min.js',
        library: 'RPGWizard',
        libraryTarget: 'umd',
        path: path.resolve(__dirname)
    },
    resolve: {
        alias: {
          cannon: path.resolve(__dirname, './src/lib/cannon/cannon.js')
        },
        extensions: [ '.tsx', '.ts', '.js' ],
      },
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
        test: /\.css$/,
        use: [
            { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
            { loader: 'css-loader' },
        ]
        }
      ]
	},
    performance: {
        hints: false
    }
};