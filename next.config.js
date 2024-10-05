module.exports = {
	output: 'export',  // Для статического экспорта
	basePath: '/OnTop',  // Указываем базовый путь, совпадающий с названием репозитория
	assetPrefix: '/OnTop/',  // Указываем префикс для статических файлов
	trailingSlash: true,  // Добавляем слэш в конце путей для совместимости с GitHub Pages
	images: {
		unoptimized: true,  // Отключаем оптимизацию изображений (нужно для GitHub Pages)
	},
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
};