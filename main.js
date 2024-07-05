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
var scoreText;
var lastFired = 0;
var fireRate = 300; // 射撃の間隔

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

    // 弾のグループ設定（無限）
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 0  // 無限にする
    });

    // 敵キャラクターのグループ設定（小さく表示）
    this.enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 100, y: 100, stepX: 100 },
        setScale: { x: 0.5, y: 0.5 } // 画像を縮小
    });

    // 敵の動きを制御するための初期設定
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.setVelocityX(Phaser.Math.Between(-100, 100));
    }, this);

    // スコア表示の設定
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // 当たり判定
    this.physics.add.collider(this.bullets, this.enemies, bulletHitEnemy, null, this);
    this.physics.add.collider(this.player, this.enemies, playerHitEnemy, null, this);

    this.input.keyboard.on('keydown-SPACE', shoot, this);
}

function update() {
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

    // 敵キャラクターの動き
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        if (enemy.x <= 50) {
            enemy.setVelocityX(Phaser.Math.Between(50, 100));
        } else if (enemy.x >= 1550) {
            enemy.setVelocityX(Phaser.Math.Between(-100, -50));
        }
    }, this);
}

function shoot() {
    var currentTime = this.time.now;

    if (currentTime > lastFired) {
        var bullet = this.bullets.get(this.player.x, this.player.y - 20);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setScale(0.5); // 弾の画像を縮小
            bullet.setVelocityY(-300);

            lastFired = currentTime + fireRate;
        }
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
    // プレイヤーと敵が衝突した場合の処理
    // 今回は何もしませんが、必要に応じて追加してください
}
