<template>
  <div ref="stageContainer" style="position: relative">
    <v-stage
      ref="stage"
      :config="configKonva"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchmove="handleTouchMove"
    >
      <v-layer>
        <v-circle
          v-for="item in list"
          ref="circles"
          :key="item.data.id"
          :config="{
            id: item.data.id,
            x: item.data.x,
            y: item.data.y,
            radius: item.data.radius,
            stroke: 'black',
            strokeWidth: item.data.strokeWidth,
            visible: item.data.visible,
          }"
        ></v-circle>
        <v-circle ref="mCircle" :config="mCircleConfig" />
      </v-layer>
    </v-stage>
    <v-card
      left
      color="rgb(0,0,0,0.4)"
      style="padding: 1%; position: absolute; left: 1%; bottom: 1%"
    >
      <div style="white-space: wrap; color: white">
        {{ statusText }}
      </div>
    </v-card>
    <v-card
      left
      color="rgb(0,0,0,0.4)"
      style="padding: 0%; position: absolute; right: 1%; bottom: 1%"
    >
      <div style="white-space: nowrap; color: white">
        {{ statusOperation }}
      </div>
    </v-card>
  </div>
</template>

<script>
import Node from "../plugins/tree";

const width = window.innerWidth;
const height = window.innerHeight;
export default {
  name: "Canvas",
  methods: {
    createCircle(x, y, r) {
      const newCircle = {
        x: x,
        y: y,
        radius: r,
        strokeWidth: 1,
        id: this.idCnt++,
        visible: true,
        markedForDeletion: false,
      };
      return newCircle;
    },
    handleMouseDown(e) {
      this.mCircleConfig.visible = true;
      this.mCircleConfig.startX = e.evt.layerX;
      this.mCircleConfig.startY = e.evt.layerY;
      this.mCircleConfig.x = this.mCircleConfig.startX;
      this.mCircleConfig.y = this.mCircleConfig.startY;
      this.mCircleConfig.radius = 0;
    },

    startCollapse() {
      //callback for drawing
      this.hiddenCross.markCollapse((child, endstate, other) => {
        //get reference to circle which has to be moved
        let ref = null;
        for (let i = 0; i < this.vue.circles.length; ++i) {
          const tmpRef = this.vue.circles[i].getNode();
          if (tmpRef.attrs.id == child.data.id) {
            ref = tmpRef;
            //mark for later deletion
            child.data.markedForDeletion = true;
            break;
          }
        }

        if (!ref) {
          console.error("Error ref not found!");
          console.error(child);
          return;
        }
        let thisOperation = "recall";
        if (other !== null) {
          //in case of recrossing delete also the other circle
          other.data.markedForDeletion = true;
          thisOperation = "recrossing";
        }

        /*
        play animations for x seconds one after another, 
        every time this function is called a
        animationduration is added
        */
        const animationDuration = 1;

        setTimeout(() => {
          //start animation
          ref.to({
            x: endstate.x,
            y: endstate.y,
            radius: endstate.radius,
            duration: animationDuration,
            onFinish: () => {
              child.data.visible = false;
              if (other !== null) {
                other.data.visible = false;
              }
            },
          });
          //Set text for current operation
          this.statusOperation = thisOperation;
        }, this.animationDelayBuffer);

        this.animationDelayBuffer += animationDuration * 1000;
      });
      this.animationDelayBuffer += 100;

      //delete all marks marked for deletion
      setTimeout(() => {
        this.deleteItems();
        this.statusOperation = "";
      }, this.animationDelayBuffer);
    },

    createMark() {
      const newCircle = this.createCircle(
        this.mCircleConfig.x,
        this.mCircleConfig.y,
        this.mCircleConfig.radius
      );
      const insideRef = this.hiddenCross.isIn(
        newCircle.x,
        newCircle.y,
        newCircle.radius
      );
      const newCross = new Node(
        insideRef.name + " " + insideRef.childs.length,
        newCircle
      );

      const dx = newCross.data.x - insideRef.data.x;
      const dy = newCross.data.y - insideRef.data.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (
        !(
          d + newCross.data.radius < insideRef.data.radius ||
          d > newCross.data.radius + insideRef.data.radius
        )
      ) {
        return;
      }
      // check if another cross inside this cross in inside the new cross
      let insideChilds = [];
      for (let i = 0; i < insideRef.childs.length; ++i) {
        const child = insideRef.childs[i];
        const dx = newCross.data.x - child.data.x;
        const dy = newCross.data.y - child.data.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d + child.data.radius < newCross.data.radius) {
          insideChilds.push(child);
        } else if (d > child.data.radius + newCross.data.radius) {
          continue;
        } else {
          return false;
        }
      }
      newCross.childs = insideChilds;
      const notFiltered = insideRef.childs.filter(
        (a) => !insideChilds.includes(a)
      );
      insideRef.childs = notFiltered;
      insideRef.childs.push(newCross);
      this.hiddenCross.refresh(null);
      this.hiddenCross.isMarked;
      this.list.push(newCross);
    },
    handleMouseUp() {
      this.animationDelayBuffer = 0;
      this.mCircleConfig.visible = false;
      if (this.mCircleConfig.radius <= 1) {
        this.startCollapse();
      } else {
        this.createMark();
      }
    },

    handleMouseMove(e) {
      if (this.mCircleConfig.visible) {
        const dx = e.evt.layerX - this.mCircleConfig.startX;
        const dy = e.evt.layerY - this.mCircleConfig.startY;
        this.mCircleConfig.x = this.mCircleConfig.startX + dx / 2;
        this.mCircleConfig.y = this.mCircleConfig.startY + dy / 2;
        this.mCircleConfig.radius = Math.sqrt(dx * dx + dy * dy) / 2;
      } else {
        const insideRef = this.hiddenCross.isIn(e.evt.layerX, e.evt.layerY, 0);
        this.statusText =
          insideRef.name +
          " is " +
          (insideRef.isMarked ? "marked" : "unmarked");
      }
    },

    deleteItems() {
      for (let i = 0; i < this.list.length; ++i) {
        if (this.list[i].data.markedForDeletion) {
          this.$delete(this.list, i);
        }
      }
      this.hiddenCross.refresh(null);
    },

    handleTouchMove(e) {
      e.evt.preventDefault();

      e.evt.layerX = e.evt.touches[0].clientX;
      e.evt.layerY = e.evt.touches[0].clientY;
      this.handleMouseMove(e);
    },
    handleTouchStart(e) {
      e.evt.preventDefault();

      e.evt.layerX = e.evt.touches[0].clientX;
      e.evt.layerY = e.evt.touches[0].clientY;
      this.handleMouseDown(e);
    },
    handleTouchEnd() {
      this.handleMouseUp();
    },
  },
  data() {
    return {
      statusOperation: "",
      statusText: "",
      hiddenCross: null,
      list: [],
      idCnt: 0,
      configKonva: {
        width: width,
        height: height,
      },
      mCircleConfig: {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        radius: 0,
        stroke: "black",
        strokeWidth: 1,
        listening: false,
        visible: false,
        dash: [4, 4],
      },
      animationDelayBuffer: 0,
      vue: null,
    };
  },
  mounted() {
    this.hiddenCross = new Node(
      "Hidden Cross",
      this.createCircle(0, 0, Infinity),
      0
    );
    this.vue = this.$refs;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
