<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5"; // Package from npm
import Node from "../plugins/tree";

export default {
  name: "App",
  data: () => ({
    hiddenCross: new Node("Hidden Cross", [0, 0, Infinity], 0),
    locked: false,
    mouseOffset: { x: 0, y: 0 },
    circle: { x: 0, y: 0, d: 0 },
    mouseOver: {
      marked: false,
      reference: null,
    },
  }),
  methods: {},
  mounted() {
    const script = (p5) => {
      p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);
      };

      p5.mousePressed = () => {
        this.locked = true;
        this.mouseOffset = { x: p5.mouseX, y: p5.mouseY };
        this.circle = { x: p5.mouseX, y: p5.mouseY, d: 0 };
      };

      p5.mouseDragged = () => {
        if (this.locked) {
          const dx = p5.mouseX - this.mouseOffset.x;
          const dy = p5.mouseY - this.mouseOffset.y;
          this.circle = {
            x: this.mouseOffset.x + dx / 2,
            y: this.mouseOffset.y + dy / 2,
            d: Math.sqrt(dx * dx + dy * dy),
          };
        }
      };
      p5.mouseMoved = () => {
        if (!this.locked) {
          const insideRef = this.hiddenCross.isIn(p5.mouseX, p5.mouseY, 0);
          this.mouseOver.reference = insideRef;
          this.mouseOver.marked = insideRef.isMarked ? "marked" : "unmarked";
        }
      };

      p5.mouseReleased = () => {
        this.locked = false;
        const insideRef = this.hiddenCross.isIn(
          this.circle.x,
          this.circle.y,
          this.circle.d
        );

        const newCross = new Node(
          "Mark_" + (insideRef.depth + 1) + "_" + insideRef.childs.length,
          [this.circle.x, this.circle.y, this.circle.d],
          insideRef.depth + 1
        );

        const dx = newCross.coord[0] - insideRef.coord[0];
        const dy = newCross.coord[1] - insideRef.coord[1];
        const d = Math.sqrt(dx * dx + dy * dy);
        if (
          !(
            d + newCross.coord[2] / 2.0 < insideRef.coord[2] / 2 ||
            d > (newCross.coord[2] + insideRef.coord[2]) / 2
          )
        ) {
          console.log("crossing the insideref");
          return;
        }

        // check if another cross inside this cross in inside the new cross
        let insideChilds = [];
        for (let i = 0; i < insideRef.childs.length; ++i) {
          const child = insideRef.childs[i];
          const dx = newCross.coord[0] - child.coord[0];
          const dy = newCross.coord[1] - child.coord[1];
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d + child.coord[2] / 2.0 < newCross.coord[2] / 2) {
            console.log("pushing child");
            insideChilds.push(child);
          } else if (d > (child.coord[2] + newCross.coord[2]) / 2) {
            console.log("Outside of cross");
            continue;
          } else {
            console.log("Crossing! Invalid operation");
            return false;
          }
        }
        newCross.childs = insideChilds;
        const notFiltered = insideRef.childs.filter(
          (a) => !insideChilds.includes(a)
        );
        insideRef.childs = notFiltered;
        insideRef.childs.push(newCross);
        console.log("insideChilds:");
        console.log(insideChilds);
        console.log("Not Filtered:");
        console.log(notFiltered);
        console.log("Insideref: ");
        console.log(insideRef);
      };

      p5.draw = () => {
        p5.clear();

        for (let i = 0; i < this.hiddenCross.childs.length; ++i) {
          this.hiddenCross.childs[i].draw((x, y, size) =>
            p5.circle(x, y, size)
          );
        }

        if (this.locked) {
          p5.circle(this.circle.x, this.circle.y, this.circle.d);
        } else {
          const name = this.mouseOver.reference
            ? this.mouseOver.reference.name
            : " ";
          p5.text(name + " is " + this.mouseOver.marked, 20, 20);
        }
      };
    };
    const p5canvas = new P5(script, "canvas");
    console.log(p5canvas);
  },
};
</script>

<style></style>