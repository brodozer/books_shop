export default (isProd) => {
	return {
		mode: isProd ? "production" : "development",
		output: {
			filename: "main.min.js",
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
					},
				},
			],
		},
		devtool: !isProd ? "source-map" : false,
	};
};
