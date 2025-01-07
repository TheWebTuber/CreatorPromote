class Barrel {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.initialX = x;
    }
  
    body() {
      circle(this.x, this.y, 75);
    }
  
    move() {
      this.x = this.x - random(5, 15);
  
      if (this.x < -80) {
        this.x = this.initialX;
      }
    }
  
    reset() {
      this.x = this.initialX;
    }
  }