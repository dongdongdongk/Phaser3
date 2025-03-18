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
        debugger
        const properties = this.mapProperties(layer.properties)
        layer.objects.forEach(collectable0 => {
            this.get(collectable0.x, collectable0.y, properties.type)
        })
    }

    mapProperties(propertiesList) {
        debugger
        if(!propertiesList || propertiesList.length === 0) {
            return
        }
        debugger
        return propertiesList.reduce((map, obj) => {
            map[obj.name] = obj.value
            return map
        }, {})
    }

}

export default Collectables;