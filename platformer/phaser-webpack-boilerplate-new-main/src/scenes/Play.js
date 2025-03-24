import Phaser from "phaser";
import Player from "../entities/Player";
import Enemies from "../groups/Enemies";
import Collectables from "../groups/Collectables";
import initAnims from "../anims";
import Hud from "../hud"
import EventEmitter from "../events/Emitter";

class Play extends Phaser.Scene {
    constructor(config) {
        super("PlayScene");
        this.config = config;
    }

    create(gameStatus) {
        this.score = 0;
        this.hud = new Hud(this, 0, 0).setDepth(1)

        const map = this.createMap();
        initAnims(this.anims);
        const layers = this.createLayers(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start);
        
        const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
        const collectables = this.createCollectables(layers.collectables);
        
        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                projectiles: enemies.getProjectiles(),
                collectables,
                traps: layers.traps,
            },
        });

        this.createBG(map);
        
        this.createEnemyColliders(enemies, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player,
            },
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCameraOn(player);
        
        if(gameStatus === 'PLAYER_LOOSE') {
            return;    
        }
        this.createGameEvents();

    }

    createGameEvents() {
        EventEmitter.on("PLAYER_LOOSE", () => {
            console.log('player loose')
            this.scene.restart({gameStatus: 'PLAYER_LOOSE'});
        })
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
                tile.index !== -1 && tile.setCollision(true)
            })
        }

        this.drawDebug(layer)

        this.platting = false
    }

    createMap() {
        const map = this.make.tilemap({key: `level_${this.getCurrentLevel()}`});
        map.addTilesetImage("main_lev_build_1", "tiles-1");

            // 디버깅용 로그 추가
        console.log("All tilesets:", map.tilesets);
        console.log("Finding tileset:", map.getTileset("bg_spikes_tileset"));
        map.addTilesetImage("bg_spikes_tileset", "bg_spikes_tileset");
        return map;
    }

    createLayers(map) {
        const tileset = map.getTileset("main_lev_build_1");
        debugger
        const tilesetBg = map.getTileset("bg_spikes_tileset");

        map.createStaticLayer("distance", tilesetBg).setDepth(-12);

        const platformsColliders = map.createStaticLayer(
            "platforms_colliders",
            tileset
        );
        const environment = map.createStaticLayer("environment", tileset);
        const platforms = map.createStaticLayer("platforms", tileset);

        const playerZones = map.getObjectLayer("player_zones");
        const enemySpawns = map.getObjectLayer("enemy_spawns");
        const collectables = map.getObjectLayer("collectables");

        const traps = map.createStaticLayer("traps", tileset);
        traps.setCollisionByExclusion(-1, true);

        platformsColliders.setCollisionByExclusion(-1, true);
        return { environment, platforms, platformsColliders, playerZones, enemySpawns, collectables, traps };
    }

    createBG(map) {
        const bgObject = map.getObjectLayer("distance_bg").objects[0];
        
        this.spikesImage = this.add.tileSprite(bgObject.x, bgObject.y, this.config.width, bgObject.height, "bg-spikes-dark")
        .setOrigin(0, 1)
        .setDepth(-10)
        .setScrollFactor(0, 1);

        this.skyImage = this.add.tileSprite(0, 0, this.config.width, 180, "sky-play")
        .setOrigin(0, 0)
        .setDepth(-11)
        .setScale(1.1)
        .setScrollFactor(0, 1);
    }

    createCollectables(collectableLayer) {
        const collectables = new Collectables(this).setDepth(-1)
        collectables.addFromLayer(collectableLayer);
        collectables.playAnimation('diamond-shine');

        return collectables;
    }

    createPlayer(start) {
        return new Player(this, start.x, start.y);
    }

    createEnemies(spawnLayer, platformsColliders) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach((spawnPoint) => {
            // if(i === 1) {
            //     return
            // }
            const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
            enemy.setPlatformColliders(platformsColliders)
            enemies.add(enemy);
        })
        return enemies;
    }

    onPlayerCollision(enemy, player) {
        player.takesHit(enemy);
      }

    createPlayerColliders(player, { colliders }) {
        player
            .addColliders(colliders.platformsColliders)
            .addColliders(colliders.projectiles, this.onHit)
            .addOverlap(colliders.collectables, this.onCollect, this)
            .addColliders(colliders.traps, this.onHit)
    }

    onHit(entity, source) {
        //console.log(`${entity} is taking a hit from ${source}`);
        entity.takesHit(source);
    }

    onCollect(entity, collectable) {
        this.score += collectable.score;
        this.hud.updateScoreboard(this.score)
        collectable.disableBody(true, true);
        collectable.destroy();
    }

    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addColliders(colliders.platformsColliders)
            .addColliders(colliders.player, this.onPlayerCollision)
            .addColliders(colliders.player.projectiles, this.onHit)
            .addOverlap(colliders.player.meleeWeapon, this.onHit)
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

    getCurrentLevel() {
        return this.registry.get('level') || 1
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
            this.registry.inc('level', 1)
            this.scene.restart({gameStatus:'LEVEL_COMPLETED'})
        });
    }

    update() {
        this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.1;
    }
}

export default Play;
