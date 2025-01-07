class Wall {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.initialX = x;
    }
  
    body() {
      rect(this.x, this.y, 20, 600);
    }
  
    move() {
      this.x = this.x - 1 * random(4.5, 10);
  
      if (this.x < -50) {
        this.x = this.initialX;
      }
    }
  
    reset() {
      this.x = this.initialX;
    }
  }