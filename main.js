const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bullets;
let lastFired = 0;
let enemies;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'player.jpg'); // プレイヤーの画像
    this.load.image('bullet', 'bullet.jpg'); // 弾の画像
    this.load.image('enemy', 'enemy.jpg'); // 敵の画像
}

function create() {
    player = this.physics.add.sprite(400, 500, 'player').setCollideWorldBounds(true);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    enemies = this.physics.add.group({
        defaultKey: 'enemy',
        maxSize: 10
    });

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    cursors = this.input.keyboard.createCursorKeys();

    this.time.addEvent({
        delay: 2000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(bullets, enemies, hitEnemy, null, this);
    this.physics.add.collider(player, enemies, gameOver, null, this);
}

function update(time, delta) {
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.space.isDown && time > lastFired) {
        const bullet = bullets.get(player.x, player.y - 20);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -300;
            lastFired = time + 500;
        }
    }

    bullets.children.each(function (bullet) {
        if (bullet.active && bullet.y < 0) {
            bullet.setActive(false);
            bullet.setVisible(false);
        }
    }, this);

    enemies.children.each(function (enemy) {
        if (enemy.active && enemy.y > 600) {
            enemy.setActive(false);
            enemy.setVisible(false);
        }
    }, this);
}

function spawnEnemy() {
    const enemy = enemies.get(Phaser.Math.Between(50, 750), 0);

    if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.body.velocity.y = 100;
    }
}

function hitEnemy(bullet, enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.setActive(false);
    enemy.setVisible(false);

    score += 10;
    scoreText.setText('Score: ' + score);
}

function gameOver(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
    scoreText.setText('Game Over');
}
