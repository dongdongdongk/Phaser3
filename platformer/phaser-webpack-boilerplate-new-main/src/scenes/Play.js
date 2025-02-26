import Phaser from "phaser";
import Player from "../entities/Player";
import Enemies from "../groups/Enemies";

class Play extends Phaser.Scene {
    constructor(config) {
        super("PlayScene");
        this.config = config;
    }

    create() {
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        const enemies = this.createEnemies(layers.enemySpawns);

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
            },
        });

        this.createEnemyColliders(enemies, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player,
            },
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);

        this.platting = false
        this.graphics = this.add.graphics();
        this.line = new Phaser.Geom.Line();
        this.graphics.lineStyle(1, 0x00ff00);

        this.input.on('pointerdown', this.startDrawing, this);
        this.input.on('pointerup',(pointer) => this.finishDrawing(pointer, layers.platforms), this);
    }

    startDrawing(pointer) {
        console.log('시작')
        this.line.x1 = pointer.worldX;
        this.line.y1 = pointer.worldY;
        this.platting = true;
    }

    finishDrawing(pointer, layer) {
        console.log('끝')
        this.line.x2 = pointer.worldX;
        this.line.y2 = pointer.worldY;
        
        this.graphics.clear();
        this.graphics.strokeLineShape(this.line);

        this.tileHits = layer.getTilesWithinShape(this.line);

        if ( this.tileHits.length > 0 ) {
            this.tileHits.forEach(tile => {
                tile.index !== -1 && console.log('타일이 있습니다.', tile)
            })
        }

        this.platting = false
    }

    createMap() {
        const map = this.make.tilemap({ key: "map" });
        map.addTilesetImage("main_lev_build_1", "tiles-1");
        return map;
    }

    createLayers(map) {
        const tileset = map.getTileset("main_lev_build_1");
        const platformsColliders = map.createStaticLayer(
            "platforms_colliders",
            tileset
        );
        const environment = map.createStaticLayer("environment", tileset);
        const platforms = map.createStaticLayer("platforms", tileset);

        const playerZones = map.getObjectLayer("player_zones");
        const enemySpawns = map.getObjectLayer("enemy_spawns");

        platformsColliders.setCollisionByExclusion(-1, true);
        return { environment, platforms, platformsColliders, playerZones, enemySpawns };
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y);
    }

    createEnemies(spawnLayer) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach(spawnPoint => {
            const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
            enemies.add(enemy);
        })
        return enemies;
    }

    createPlayerColliders(player, { colliders }) {
        player.addColliders(colliders.platformsColliders);
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addColliders(colliders.platformsColliders)
            .addColliders(colliders.player);
    }

    setupFollowupCameraOn(player) {
        const { height, width, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height)
            .setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
        };
    }

    createEndOfLevel(end, player) {
        const endOfLevel = this.physics.add
            .sprite(end.x, end.y, "end")
            .setSize(5, this.config.height)
            .setAlpha(0)
            .setOrigin(0.5, 1);

        const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
            eolOverlap.active = false;
            console.log("End of level reached!");
        });
    }

    update() {
        if( this.platting ) {
            const pointer = this.input.activePointer;
    
            this.line.x2 = pointer.worldX
            this.line.y2 = pointer.worldY
            this.graphics.clear()
            this.graphics.strokeLineShape(this.line)
        }
    }
}

export default Play;
