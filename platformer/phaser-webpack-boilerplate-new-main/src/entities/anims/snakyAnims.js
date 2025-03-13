export default anims => {
    anims.create({
        key: 'snaky-walk',
        frames: anims.generateFrameNumbers('snaky', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1,
    })

    anims.create({
        key: 'snaky-hurt',
        frames: anims.generateFrameNumbers('snaky', { start: 22, end: 24 }),
        frameRate: 10,
        repeat: 0,
    })


    anims.create({
        key: 'snaky-die',
        frames: anims.generateFrameNumbers('snaky', { start: 1, end: 1 }),
        frameRate: 10,
        repeat: 0,
    })
}