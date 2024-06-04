class Ghost {
    constructor(
        x,              // Hayaletin x koordinatı
        y,              // Hayaletin y koordinatı
        width,          // Hayaletin genişliği
        height,         // Hayaletin yüksekliği
        speed,          // Hareket hızı
        imageX,         // Hayaletin resminin x koordinatı
        imageY,         // Hayaletin resminin y koordinatı
        imageWidth,     // Hayaletin resminin genişliği
        imageHeight,    // Hayaletin resminin yüksekliği
        range           // Hayaletin izlediği aralık
    ) {
        // Hayaletin başlangıç koordinatları
        this.x = x;
        this.y = y;
        // Hayaletin boyutları
        this.width = width;
        this.height = height;
        // Hareket hızı
        this.speed = speed;
        // Hareket yönü (başlangıçta sağa doğru)
        this.direction = DIRECTION_RIGHT;
        // Hayaletin resim koordinatları
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        // Hayaletin hareket aralığı
        this.range = range;
        // Hayaletin rastgele hedefi seçmek için kullanılacak indis
        this.randomTargetIndex = parseInt(Math.random() * 4);
        // Hayaletin hedefini değiştirmek için periyodik olarak çağrılan fonksiyon
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    // Hayaletin belirli bir mesafede olup olmadığını kontrol eder
    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true; // Hayalet mesafede
        }
        return false; // Hayalet mesafede değil
    }

    // Hayaletin rastgele yönünü değiştirir
    changeRandomDirection() {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    // Hayaletin hareket işlemini yönetir
    moveProcess() {
        if (this.isInRange()) {
            this.target = pacman; // Hedef pacman ise ona doğru hareket et
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex]; // Rastgele hedefe doğru hareket et
        }
        this.changeDirectionIfPossible(); // Mümkünse yönü değiştir
        this.moveForwards(); // Hareket et
        if (this.checkCollisions()) {
            this.moveBackwards(); // Çarpışma varsa geriye hareket et
            return;
        }
    }

    // Hayaleti geriye doğru hareket ettirir
    moveBackwards() {
        switch (this.direction) {
            case 4: // Sağa
                this.x -= this.speed;
                break;
            case 3: // Yukarı
                this.y += this.speed;
                break;
            case 2: // Sola
                this.x += this.speed;
                break;
            case 1: // Aşağı
                this.y -= this.speed;
                break;
        }
    }

    // Hayaleti ileriye doğru hareket ettirir
    moveForwards() {
        switch (this.direction) {
            case 4: // Sağa
                this.x += this.speed;
                break;
            case 3: // Yukarı
                this.y -= this.speed;
                break;
            case 2: // Sola
                this.x -= this.speed;
                break;
            case 1: // Aşağı
                this.y += this.speed;
                break;
        }
    }

    // Hayaletin çarpışmalarını kontrol eder
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
            isCollided = true; // Çarpışma var
        }
        return isCollided;
    }

    // Mümkünse yönü değiştirir
    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        );
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction == DIRECTION_LEFT ||
                this.direction == DIRECTION_RIGHT)
        ) {
            this.direction = DIRECTION_UP;
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            this.direction == DIRECTION_UP
        ) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
        console.log(this.direction); // Hayaletin yeni yönü
    }

    // Yeni yönu hesaplar
    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // Yön
    }

    // Komşuları ekler
    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    // Hayaletin x koordinatını döndürür
    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    // Hayaletin y koordinatını döndürür
    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    // Hayaletin x koordinatını sağ kenarını döndürür
    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    // Hayaletin y koordinatını alt kenarını döndürür
    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    // Animasyonu değiştirir
    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    // Hayaleti çizer
    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
        canvasContext.restore();
        // Hayaletin izlediği aralığı gösterir
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2,
            this.range * oneBlockSize,
            0,
            2 * Math.PI
        );
        canvasContext.stroke();
    }
}

// Hayaletleri günceller
let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

// Hayaletleri çizer
let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
