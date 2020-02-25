class SpriteShockUtil {
    private time: number;
    private sprite: Laya.Sprite;
    private caller: any;
    private amp: number;
    private ctime: number;
    private initx: number;
    private inity: number;

    public constructor() {
    
    }
    
    private update(): void {
        if(!this.sprite){
            this.clearShock();
            return;
        }
        this.ctime += this.sprite.timer.delta;
        if (this.ctime > this.time) {
            this.clearShock();
            this.sprite.pos(this.initx,this.inity);
            return;
        }
        var ranX: number = this.initx + (Math.random() - 0.5) * this.amp;
        var ranY: number = this.inity + (Math.random() - 0.5) * this.amp;
        this.sprite.pos(ranX,ranY);
    }

    public shock(caller:any,sprite: Laya.Sprite, time: number, amp: number): void {
        if (sprite) {
            this.sprite = sprite;
            this.caller = caller;
            this.time = time;
            this.ctime = 0;
            this.amp = amp;
            this.initx = sprite.x;
            this.inity = sprite.y;
            this.sprite.frameLoop(1, this, this.update);
        }
    }

    public clearShock() {
        if(this.sprite){
            this.sprite.clearTimer(this,this.update);
        }
    }
}