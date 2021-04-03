
export default class Node {
    constructor(name, data, depth = 0) {
        this.childs = [];
        this.data = data;
        this.name = name;
        this.depth = depth;
    }


    isMarked(visualizeMarkedStateFunc = null) {
        let marked = false;
        if (this.childs.length == 0) {
            marked = false;
        }
        else if (this.childs.length == 1) {
            marked = !this.childs[0].isMarked(visualizeMarkedStateFunc);
        }
        else {
            for (let i = 0; i < this.childs.length; ++i) {
                if (!this.childs[i].isMarked(visualizeMarkedStateFunc)) {
                    marked = true;
                    break;
                }
            }
        }
        if(visualizeMarkedStateFunc)
        {
            visualizeMarkedStateFunc(this,marked);
        }

        return marked;
    }

    refresh(parent, index = 0) {
        const hiddenCrossName = "0";
        if (parent == null) {
            this.name = hiddenCrossName;
            this.depth = 0;
        }
        else {
            this.depth = parent.depth + 1;
            this.name = parent.name + " " + (index + 1);
        }
        this.childs.forEach((child, i) => child.refresh(this, i));
    }

    markCollapse(drawHandler) {
        if (!this.childs.length) {
            return false;
        }

        if (this.childs.length == 1 &&
            !this.childs[0].markCollapse(drawHandler)) {
            return true;
        }

        if (this.childs.length == 1 &&
            this.childs[0].childs.length == 1 &&
            !this.childs[0].childs[0].markCollapse(drawHandler)) {
            const childChild = this.childs[0].childs[0];
            drawHandler(childChild,
                { x: this.childs[0].data.x, y: this.childs[0].data.y, radius: this.childs[0].data.radius },
                this.childs[0]);
            this.childs[0].childs.splice(0, 1);
            this.childs.splice(0, 1);
            return false;
        }


        if (this.childs.length > 1) {
            const m0 = this.childs[0].markCollapse(drawHandler);
            const m1 = this.childs[1].markCollapse(drawHandler);

            if (m0) {
                const childChild = this.childs[0].childs[0];
                drawHandler(childChild,
                    { x: this.childs[0].data.x, y: this.childs[0].data.y, radius: this.childs[0].data.radius },
                    this.childs[0]);
                if (!m1)
                    this.childs.splice(0, 1);
            }
            if (m1) {
                const childChild = this.childs[1].childs[0];
                drawHandler(childChild,
                    { x: this.childs[1].data.x, y: this.childs[1].data.y, radius: this.childs[1].data.radius },
                    this.childs[1]);
                if (!m0)
                    this.childs.splice(1, 1);
            }
            if (m0 && m1)
                this.childs.splice(0, 2);

            if (!m0 && !m1) {
                drawHandler(this.childs[0],
                    {
                        x: this.childs[1].data.x,
                        y: this.childs[1].data.y,
                        radius: this.childs[1].data.radius
                    },
                    null
                );
                this.childs.splice(0, 1);
            }
        }
        return this.markCollapse(drawHandler);
    }

    draw(drawHandler) {
        drawHandler(this.coord[0], this.coord[1], this.coord[2]);
        for (let i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw(drawHandler);
        }
    }

    isIn(x, y, r) {
        const dx = this.data.x - x;
        const dy = this.data.y - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        let insideRef = (d < (this.data.radius) &&
            (r < this.data.radius)) ? this : null;
        if (insideRef) {
            for (let i = 0; i < this.childs.length; ++i) {
                const tmpInsideRef = this.childs[i].isIn(x, y, r);
                if (tmpInsideRef) {
                    insideRef = tmpInsideRef;
                    break;
                }
            }
        }
        return insideRef;
    }
}