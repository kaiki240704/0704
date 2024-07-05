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
    backgroundColor: '#ffffff', // 背景色を白色に設定
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var score = 0;
var scoreText; // スコア表示用のテキストオブジェクト
var lastFired = 0;
var fireRate = 300; // 射撃の間隔
var playerSpeed = 200; // プレイヤーの移動速度
var enemySpeed = 150; // 敵の移動速度
var gameOver = false;

function preload() {
    this.load.image('player', 'assets/player.jpg');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('enemy', 'assets/enemy.jpg');
    this.load.image('background', 'assets/background.jpg');
}

function create() {
    // フィールドのサイズを設定
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // プレイヤーキャラクターの設定（小さく表示）
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.5); // 画像を縮小

    // カメラがプレイヤーを追従するように設定
    this.cameras.main.startFollow(this.player);

    // キーボード入力の設定
    this.cursors = this.input.keyboard.createCursorKeys();

    // 弾のグループ設定
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 30,
        runChildUpdate: true
    });

    // 敵キャラクターのグループ設定（小さく表示、10体）
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 9,  // 10体の敵を設定するため、repeatを9に設定（最初の1体も含むため）
        setXY: { x: 100, y: 100, stepX: 150 },
        setScale: { x: 0.5, y: 0.5 }
    });

    // 敵の動きを制御するための初期設定
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.setVelocityX(Phaser.Math.Between(-enemySpeed, enemySpeed));
        enemy.setVelocityY(Phaser.Math.Between(-enemySpeed, enemySpeed));
    }, this);

    // スコア表示の設定
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // 当たり判定
    this.physics.add.collider(this.bullets, this.enemies, bulletHitEnemy, null, this);
    this.physics.add.collider(this.player, this.enemies, playerHitEnemy, null, this);

    this.input.keyboard.on('keydown-SPACE', shoot, this);
}

function update() {
    if (gameOver) {
        this.player.setVelocity(0);
        Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
            enemy.setVelocity(0);
        }, this);
        return;
    }

    // プレイヤーの移動
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-playerSpeed);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(playerSpeed);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-playerSpeed);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(playerSpeed);
    } else {
        this.player.setVelocityY(0);
    }

    // 敵キャラクターの動き
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        // 画面端で反転するように設定
        if (enemy.x <= 50 || enemy.x >= 1550) {
            enemy.setVelocityX(-enemy.body.velocity.x);
        }
        if (enemy.y <= 50 || enemy.y >= 1150) {
            enemy.setVelocityY(-enemy.body.velocity.y);
        }
    }, this);
}

function shoot() {
    var currentTime = this.time.now;

    if (currentTime > lastFired) {
        var bullet = this.bullets.get(this.player.x, this.player.y - 20);

        if (!bullet) {
            bullet = this.physics.add.image(this.player.x, this.player.y - 20, 'bullet');
            this.bullets.add(bullet);
            bullet.setCollideWorldBounds(true);
            bullet.on('worldbounds', function() {
                bullet.disableBody(true, true);
            });
        } else {
            bullet.enableBody(true, this.player.x, this.player.y - 20, true, true);
        }

        bullet.setVelocityY(-300);
        lastFired = currentTime + fireRate;
    }
}

function bulletHitEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);

    // スコアを増やす
    score += 10;
    scoreText.setText('Score: ' + score);
}

function playerHitEnemy(player, enemy) {
    player.setTint(0xff0000); // プレイヤーを赤くする
    gameOver = true;

    var gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ff0000' });
    gameOverText.setOrigin(0.5, 0.5);

    this.physics.pause(); // ゲームを一時停止
}
