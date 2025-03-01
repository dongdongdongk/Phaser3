

export default {
    addColliders(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
        return this
    },

    bodyPositionDifferenceX: 0,
    prevRay: null,
    prevHasHit: null,

    raycast(body, layer, { raylength = 30, precision = 0, steepnes = 1 }) {
        const { x, y, width, halfHeight } = body;
        // console.log("현재 감지 중인 레이어:", layer);

        this.bodyPositionDifferenceX += body.x - body.prev.x;

        if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null ) {
            return {
                ray: this.prevRay,       // 이전 레이 값 그대로 반환
                hasHit: this.prevHasHit   // 이전 충돌 결과 그대로 반환
            }
        }

        const line = new Phaser.Geom.Line();
        let hasHit = false;
        
        switch(body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT: {
              line.x1 = x + width;
              line.y1 = y + halfHeight;
              line.x2 = line.x1 + raylength * steepnes;
              line.y2 = line.y1 + raylength;
              break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT: {
              line.x1 = x;
              line.y1 = y + halfHeight;
              line.x2 = line.x1 - raylength * steepnes;
              line.y2 = line.y1 + raylength;
              break;
            }
          }
  
        const hits = layer.getTilesWithinShape(line);

        // console.log("감지된 타일:", hits);
        // console.log("타일 인덱스 값:", hits.map(hit => hit.index));
        if (hits.length > 0) {
            hasHit = this.prevHasHit = hits.some(hit => hit.index !== -1);
            this.prevHasHit = null
        }

        this.prevRay = line;
        this.bodyPositionDifferenceX = 0;
        
        // console.log("레이케스트")
        return { ray: line, hasHit }

    }
}