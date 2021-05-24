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
          cannon: path.resolve(__dirname, './src/lib/cannon/cannon.js'),
          src: path.resolve(__dirname, 'src'),
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
            test: /\.css$/i,
            use: [
              "style-loader",
              "@teamsupercell/typings-for-css-modules-loader",
              {
                loader: "css-loader",
                options: { modules: true }
              }
            ]
          }
      ]
	},
    performance: {
        hints: false
    }
};