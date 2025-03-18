import Phaser from "phaser";
import Collectable from "../collectables/Collectable";

class Collectables extends Phaser.Physics.Arcade.StaticGroup {
    constructor(scene) {
        super(scene.physics.world, scene)

        this.createFromConfig({
            classType: Collectable
        })
    }
    

    addFromLayer(layer) {
        const {score: defaultScore, type} = this.mapProperties(layer.properties)
        layer.objects.forEach(collectable0 => {
            const collectable = this.get(collectable0.x, collectable0.y, type)
            const props = this.mapProperties(collectable0.properties)

            collectable.score = props.score || defaultScore;

            // collectable.setScale(collectable.score * 0.4);

        })
        const a = this.getChildren().map(diamond => diamond.score)
        debugger
    }

    mapProperties(propertiesList) {
        if(!propertiesList || propertiesList.length === 0) {
            return {}
        }
        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value
            return map
        }, {})
    }

}

export default Collectables;