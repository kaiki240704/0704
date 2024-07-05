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
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
}

function create () {
    // フィールドのサイズを設定
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // 背景画像を追加
    this.add.image(800, 600, 'background').setOrigin(0.5).setDisplaySize(1600, 1200);

    // プレイヤーキャラクターの設定
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);

    // カメラがプレイヤーを追従するように設定
    this.cameras.main.startFollow(this.player);

    // キーボード入力の設定
    this.cursors = this.input.keyboard.createCursorKeys();

    // 弾のグループ設定
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    // 敵キャラクターのグループ設定
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100 }
    });

    this.input.keyboard.on('keydown-SPACE', shoot, this);
}

function update () {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(200);
    } else {
        this.player.setVelocityY(0);
    }
}

function shoot() {
    var bullet = this.bullets.get(this.player.x, this.player.y - 20);

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-300);
    }
}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
}

function create () {
    // フィールドのサイズを設定
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // 背景画像を追加（小さく表示）
    var background = this.add.image(800, 600, 'background').setOrigin(0.5);
    background.setScale(0.5); // 画像を縮小

    // プレイヤーキャラクターの設定（小さく表示）
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5); // 画像を縮小

    // カメラがプレイヤーを追従するように設定
    this.cameras.main.startFollow(this.player);

    // キーボード入力の設定
    this.cursors = this.input.keyboard.createCursorKeys();

    // 弾のグループ設定（小さく表示）
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10,
        setScale: { x: 0.5, y: 0.5 } // 画像を縮小
    });

    // 敵キャラクターのグループ設定（小さく表示）
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100 },
        setScale: { x: 0.5, y: 0.5 } // 画像を縮小
    });

    this.input.keyboard.on('keydown-SPACE', shoot, this);
}

function update () {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(200);
    } else {
        this.player.setVelocityY(0);
    }
}

function shoot() {
    var bullet = this.bullets.get(this.player.x, this.player.y - 20);

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-300);
    }
}
