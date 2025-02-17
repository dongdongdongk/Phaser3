

export default {
    addColliders(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
}