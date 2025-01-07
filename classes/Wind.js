class Wind {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.depth = random(50, 150);
      this.vx = this.depth / 100;
    }
  
    body() {
      noStroke();
      fill(this.depth);
      rect(this.x, this.y, 50, 10);
    }
  
    move() {
      this.x = this.x - this.vx;
  
      if (this.x < -50) {
        this.x = 610;
        this.y = random(height);
      }
    }
  }