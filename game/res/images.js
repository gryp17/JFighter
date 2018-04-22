var GAME_IMAGES = {
	MAIN_MENU: "img/menu/menu.png",
	//planes
	PLANES: {
		BF109: {
			SPRITE: {
				DEFAULT: [
					"img/planes/bf109/default/1.png",
					"img/planes/bf109/default/2.png"
				],
				DAMAGED: [
					"img/planes/bf109/damaged/1.png",
					"img/planes/bf109/damaged/2.png"
				]
			},
			CRASHED: "img/planes/bf109/crashed.png"
		},
		STUKA: {
			SPRITE: {
				DEFAULT: [
					"img/planes/stuka/default/1.png",
					"img/planes/stuka/default/2.png"
				],
				DAMAGED: [
					"img/planes/stuka/damaged/1.png",
					"img/planes/stuka/damaged/2.png"
				]
			},
			CRASHED: "img/planes/stuka/crashed.png"
		},
		KI84: {
			SPRITE: {
				DEFAULT: [
					"img/planes/ki84/default/1.png",
					"img/planes/ki84/default/2.png"
				],
				DAMAGED: [
					"img/planes/ki84/damaged/1.png",
					"img/planes/ki84/damaged/2.png"
				]
			},
			CRASHED: "img/planes/ki84/crashed.png"
		}
	},
	//levels
	LEVELS: {
		GRASSLAND: "img/levels/grassland.jpg",
		DESERT: "img/levels/desert.jpg",
		WINTER: "img/levels/winter.jpg"
	},
	PROJECTILES: {
		BULLET: "img/projectiles/bullet.png",
		PLANE_BOMB: [
			"img/projectiles/plane-bomb/1.png",
			"img/projectiles/plane-bomb/2.png"
		],
		BOMBER_BOMB: [
			"img/projectiles/bomber-bomb/1.png",
			"img/projectiles/bomber-bomb/2.png"
		]
	},
	BULLET_IMPACT: [
		"img/projectiles/bullet-impact/1.png",
		"img/projectiles/bullet-impact/2.png",
		"img/projectiles/bullet-impact/3.png"
	],
	EXPLOSION: [
		"img/explosion/1.png",
		"img/explosion/2.png",
		"img/explosion/3.png",
		"img/explosion/4.png",
		"img/explosion/5.png",
		"img/explosion/6.png",
		"img/explosion/7.png",
		"img/explosion/8.png",
		"img/explosion/9.png",
		"img/explosion/10.png",
		"img/explosion/11.png",
		"img/explosion/12.png",
		"img/explosion/13.png",
		"img/explosion/14.png",
		"img/explosion/15.png",
		"img/explosion/16.png",
		"img/explosion/17.png",
		"img/explosion/18.png",
		"img/explosion/19.png",
		"img/explosion/20.png",
		"img/explosion/21.png",
		"img/explosion/22.png",
		"img/explosion/23.png",
		"img/explosion/24.png",
		"img/explosion/25.png",
		"img/explosion/26.png",
		"img/explosion/27.png",
		"img/explosion/28.png",
		"img/explosion/29.png",
		"img/explosion/30.png",
		"img/explosion/31.png",
		"img/explosion/32.png",
		"img/explosion/33.png",
		"img/explosion/34.png",
		"img/explosion/35.png",
		"img/explosion/36.png",
		"img/explosion/37.png"
	],
	BOMB_HOLE: "img/bomb_hole.png",
	//enemies
	ENEMIES: {
		//bomber
		B17: {
			SPRITE: {
				DEFAULT: [
					"img/enemies/b17/default/1.png",
					"img/enemies/b17/default/2.png"
				],
				DAMAGED: [
					"img/enemies/b17/damaged/1.png",
					"img/enemies/b17/damaged/2.png"
				]
			},
			CRASHED: "img/enemies/b17/crashed.png"
		},
		SHERMAN: {
			SPRITE: [
				"img/enemies/sherman/1.png",
				"img/enemies/sherman/2.png"
			],
			DESTROYED: "img/enemies/sherman/destroyed.png"
		},
		MUSTANG: {
			SPRITE: {
				DEFAULT: [
					"img/enemies/mustang/default/1.png",
					"img/enemies/mustang/default/2.png"
				],
				DAMAGED: [
					"img/enemies/mustang/damaged/1.png",
					"img/enemies/mustang/damaged/2.png"
				]
			},
			CRASHED: "img/enemies/mustang/crashed.png"
		},
		SPITFIRE: {
			SPRITE: {
				DEFAULT: [
					"img/enemies/spitfire/default/1.png",
					"img/enemies/spitfire/default/2.png"
				],
				DAMAGED: [
					"img/enemies/spitfire/damaged/1.png",
					"img/enemies/spitfire/damaged/2.png"
				]
			},
			CRASHED: "img/enemies/spitfire/crashed.png"
		}
	},
	CIVILIANS: [
		{
			SPRITE: [
				"img/civilian/green/1.png",
				"img/civilian/green/2.png",
				"img/civilian/green/3.png",
				"img/civilian/green/4.png",
				"img/civilian/green/5.png",
				"img/civilian/green/6.png",
				"img/civilian/green/7.png",
				"img/civilian/green/8.png"
			],
			DEAD: "img/civilian/green/9.png"
		},
		{
			SPRITE: [
				"img/civilian/blue/1.png",
				"img/civilian/blue/2.png",
				"img/civilian/blue/3.png",
				"img/civilian/blue/4.png",
				"img/civilian/blue/5.png",
				"img/civilian/blue/6.png",
				"img/civilian/blue/7.png",
				"img/civilian/blue/8.png"
			],
			DEAD: "img/civilian/blue/9.png"
		},
		{
			SPRITE: [
				"img/civilian/red/1.png",
				"img/civilian/red/2.png",
				"img/civilian/red/4.png",
				"img/civilian/red/5.png",
				"img/civilian/red/6.png",
				"img/civilian/red/7.png",
				"img/civilian/red/8.png"
			],
			DEAD: "img/civilian/red/9.png"
		}
	],
	HUD: {
		BOMB_ICON: "img/hud/bomb_icon.png"
	}
};
