class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x; // Pacman'ın x koordinatı
        this.y = y; // Pacman'ın y koordinatı
        this.width = width; // Pacman'ın genişliği
        this.height = height; // Pacman'ın yüksekliği
        this.speed = speed; // Pacman'ın hareket hızı
        this.direction = 4; // Pacman'ın hareket yönü (başlangıçta sağ)
        this.nextDirection = 4; // Pacman'ın bir sonraki hareket yönü (başlangıçta sağ)
        this.frameCount = 7; // Pacman animasyonunun toplam kare sayısı
        this.currentFrame = 1; // Pacman'ın şu anki animasyon karesi (başlangıçta 1)
        
        // Animasyonu değiştirmek için zamanlayıcı
        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    // Pacman'ın hareket işlemi
    moveProcess() {
        this.changeDirectionIfPossible(); // Mümkünse yönü değiştirir
        this.moveForwards(); // Öne doğru hareket eder
        if (this.checkCollisions()) { // Çarpışma kontrolü yapar
            this.moveBackwards(); // Geri hareket eder
            return;
        }
    }

    // Yiyecekleri yeme işlemi
    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3; // Yiyeceği yedikten sonra haritadan kaldır
                    score++; // Skoru artır
                }
            }
        }
    }

    // Geriye doğru hareket işlemi
    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Sağ
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Yukarı
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Sol
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Aşağı
                this.y -= this.speed;
                break;
        }
    }

    // Öne doğru hareket işlemi
    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Sağ
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Yukarı
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Sol
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Aşağı
                this.y += this.speed;
                break;
        }
    }

    // Çarpışmaları kontrol eder
    checkCollisions() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    // Hayalet çarpışmalarını kontrol eder
    checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }
        return false;
    }

    // Yönü değiştirebilirse yönü değiştirir
    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    // Pacman'ın harita üzerindeki x koordinatını hesaplar
    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    // Pacman'ın harita üzerindeki y koordinatını hesaplar
    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    // Pacman'ın sağ tarafındaki harita üzerindeki x koordinatını hesaplar
    getMapXRightSide() {
        return parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
    }

    // Pacman'ın sağ tarafındaki harita üzerindeki y koordinatını hesaplar
    getMapYRightSide() {
        return parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
    }

    // Animasyon karesini değiştirir
    changeAnimation() {
        this.currentFrame = (this.currentFrame == this.frameCount) ? 1 : this.currentFrame + 1;
    }

    // Pacman'ı çizer
    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
    }
}
