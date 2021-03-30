

export default class Node {
    constructor(name, coord, depth) {
        this.childs = [];
        this.name = name;
        this.coord = coord;
        this.depth = depth;
    }

    lawOfCalling() {
        //To recall is to call.
        for (let i = 0; i < this.childs.length; ++i) {
            if (this.childs[i].isMarked) {
                for (let u = i; u < this.childs.length; ++u) {
                    if (this.childs[u].isMarked) {
                        this.childs[u].splice(u, 1);
                    }
                }
            }
        }
    }

    lawOfCrossing() {
        // To recross is not to cross
        let marked = true;
        for (let i = 0; i < this.childs.length; ++i) {
            if (this.childs[i].isMarked) {
                marked = false;
            }
        }
        return marked;
    }

    get isMarked() {
        let marked = true;
        if (!this.childs.length) {
            marked = false;
        }
        else {
            marked = this.lawOfCrossing()
        }
        return marked;
    }

    draw(drawHandler) {
        drawHandler(this.coord[0], this.coord[1], this.coord[2]);
        for (let i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw(drawHandler);
        }
    }

    isIn(x, y, diameter) {
        const dx = this.coord[0] - x;
        const dy = this.coord[1] - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        let insideRef = (d < (this.coord[2] / 2) && (diameter < this.coord[2])) ? this : null;
        if (insideRef) {
            for (let i = 0; i < this.childs.length; ++i) {
                const tmpInsideRef = this.childs[i].isIn(x, y, diameter);
                if (tmpInsideRef) {
                    insideRef = tmpInsideRef;
                    break;
                }
            }
        }
        return insideRef;
    }
}
