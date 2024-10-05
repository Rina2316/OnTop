module.exports = {
	// images: {
	// 	domains: ['courses-top.ru']
	// },
	webpack(config, options) {
		config.module.rules.push({
			loader: '@svgr/webpack',
			issuer: /\.[jt]sx?$/,
			options: {
				prettier: false,
				svgo: true,
				svgoConfig: {
					plugins: [{
						name: 'preset-default',
						params: {
							override: {
								removeViewBox: false
							}
						}
					}],
				},
				titleProp: true,
			},
			test: /\.svg$/,
		});

		return config;
	},
	output: 'export',  // Включает статический экспорт
	trailingSlash: true, // Добавляет слэш в конце путей для совместимости с GitHub Pages
	images: {
		unoptimized: true, // Отключает оптимизацию изображений (так как GitHub Pages не поддерживает Image Optimization)
	},
};