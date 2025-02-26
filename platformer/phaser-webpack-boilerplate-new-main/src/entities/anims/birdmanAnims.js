export default anims => {
    anims.create({
        key: 'birdman-idle',
        frames: anims.generateFrameNumbers('birdman', { start: 0, end: 12 }),
        frameRate: 10,
        repeat: -1,
    })
}