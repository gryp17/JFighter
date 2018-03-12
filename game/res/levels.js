var LEVELS_DATA = {
	GRASSLAND: {
		WEATHER: "normal",
		CIVILIANS: [
			{
				objectType: "Civilian",
				arguments: {
					x: 1000,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1050,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1110,
					y: 550
				}
			}
		],
		ENEMIES: [
			{
				objectType: "Bomber",
				arguments: {
					x: 1100,
					y: 0
				}
			},
			{
				objectType: "Bomber",
				arguments: {
					x: 1800,
					y: 100
				}
			},
			{
				objectType: "Bomber",
				arguments: {
					x: 2500,
					y: 150
				}
			}
		]
	},
	DESERT: {
		WEATHER: "normal",
		CIVILIANS: [],
		ENEMIES: [
			{
				objectType: "Bomber",
				arguments: {
					x: 700,
					y: 300
				}
			},
			{
				objectType: "Bomber",
				arguments: {
					x: 1200,
					y: 400
				}
			}
		]
	},
	WINTER: {
		WEATHER: "snow",
		CIVILIANS: [],
		ENEMIES: [
			{
				objectType: "Bomber",
				arguments: {
					x: 700,
					y: 300
				}
			},
			{
				objectType: "Bomber",
				arguments: {
					x: 1200,
					y: 400
				}
			}
		]
	}
};