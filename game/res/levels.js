var LEVELS_DATA = {
	GRASSLAND: {
		WEATHER: {
			TYPE: "rain",
			INTERVAL: 4096 //(background.width / background.dx) / 2
		},
		GROUND_HEIGHT: 40,
		CIVILIANS: [
			{
				objectType: "Civilian",
				arguments: {
					x: 1300,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1350,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1410,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1510,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1540,
					y: 550
				}
			},
			{
				objectType: "Civilian",
				arguments: {
					x: 1590,
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
			},
			{
				objectType: "Sherman",
				arguments: {
					x: 1100,
					y: 540
				}
			},
			{
				objectType: "Sherman",
				arguments: {
					x: 1700,
					y: 540
				}
			},
			{
				objectType: "Fighter",
				arguments: {
					x: 1600,
					y: 150
				}
			}
		]
	},
	DESERT: {
		WEATHER: {
			TYPE: "normal"
		},
		GROUND_HEIGHT: 40,
		CIVILIANS: [],
		ENEMIES: [
			{
				objectType: "Bomber",
				arguments: {
					x: 2700,
					y: 200
				}
			},
			{
				objectType: "Bomber",
				arguments: {
					x: 1700,
					y: 300
				}
			},
			{
				objectType: "Fighter",
				arguments: {
					x: 1200,
					y: 400
				}
			},
			{
				objectType: "Fighter",
				arguments: {
					x: 1200,
					y: 0
				}
			},
			{
				objectType: "Fighter",
				arguments: {
					x: 1400,
					y: 100
				}
			},
			{
				objectType: "Fighter",
				arguments: {
					x: 1600,
					y: 200
				}
			}
		]
	},
	WINTER: {
		WEATHER: {
			TYPE: "snow"
		},
		GROUND_HEIGHT: 40,
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