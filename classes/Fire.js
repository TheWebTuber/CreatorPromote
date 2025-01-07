class Fire {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
    }
  
    move() {
      this.x = this.x + 2;
    }
  
    show() {
      strokeWeight(1);
      ellipse(this.x, this.y, this.r * 2);
    }
  }