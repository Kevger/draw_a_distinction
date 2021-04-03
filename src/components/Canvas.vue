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
      @wheel="handleScroll"
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
      color="primary"
      style="padding: 0.3%; position: absolute; left: 1%; bottom: 1%"
      text-color="white"
    >
      <div style="white-space: nowrap; color: white">
        {{ " " + statusText + " " }}
      </div>
    </v-card>

    <v-card
      color="primary"
      style="padding: 0.3%; position: absolute; right: 1%; bottom: 1%"
      text-color="white"
    >
      <div style="white-space: nowrap; color: white">
        {{ statusOperation }}
      </div>
    </v-card>

    <v-menu
      v-model="active_menu"
      :close-on-content-click="false"
      :close-on-click="false"
      :nudge-width="150"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-hover>
          <v-chip
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 5 : 2}`"
            style="position: absolute; top: 10px; left: 10px"
            v-ripple
            color="primary"
            text-color="white"
            v-on="on"
          >
            <v-avatar> <v-icon>mdi-cog</v-icon> </v-avatar>
            Controls
          </v-chip>
        </v-hover>
      </template>

      <v-card dark color="rgb(0,0,0,0.5)">
        <v-card-title
          style="
            padding-left: 2%;
            padding-right: 2%;
            padding-bottom: 1%;
            padding-top: 4%;
          "
          >Laws of Form</v-card-title
        >
        <v-card-subtitle
          style="
            padding-left: 2%;
            padding-right: 2%;
            padding-bottom: 1%;
            padding-top: 4%;
          "
          >Draw a distinction!</v-card-subtitle
        >
        <v-container
          style="padding-left: 2%; padding-right: 2%; padding-top: 0%"
          fluid
        >
          <v-row no-gutters>
            <v-col>
              <v-slider
                v-model="animationDuration"
                min="0"
                max="5"
                step="0.2"
                label="Speed"
                append-icon="mdi-metronome"
              ></v-slider>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-card-actions>
                <v-btn
                  v-model="isRunning"
                  :color="isRunning ? 'secondary' : 'primary'"
                  @click="startCollapse"
                >
                  <v-icon>mdi-play</v-icon>run
                </v-btn>
                <v-btn
                  v-model="configKonva.draggable"
                  :color="configKonva.draggable ? 'secondary' : 'primary'"
                  value="false"
                  @click="configKonva.draggable = !configKonva.draggable"
                  hide-details
                >
                  <v-icon>mdi-cursor-pointer</v-icon>Move
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-menu>
  </div>
</template>





<script>
import Node from "../plugins/tree";

const width = window.innerWidth;
const height = window.innerHeight;
export default {
  name: "Canvas",
  data() {
    return {
      stage: null,
      isRunning: false,
      active_menu: true,
      animationDuration: 1,
      statusOperation: "",
      statusText: "",
      hiddenCross: null,
      list: [],
      idCnt: 0,
      configKonva: {
        width: width,
        height: height,
        draggable: false,
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
  methods: {
    createCircle(x, y, r, strokeWidth = 1) {
      const newCircle = {
        x: x,
        y: y,
        radius: r,
        strokeWidth: strokeWidth,
        id: this.idCnt++,
        visible: true,
        markedForDeletion: false,
        nativeStrokeWidth: strokeWidth,
      };
      return newCircle;
    },
    getRelativePointerPos() {
      const scale = this.stage.scaleX();
      const pointer = this.stage.getPointerPosition();
      return {
        x: (pointer.x - this.stage.x()) / scale,
        y: (pointer.y - this.stage.y()) / scale,
      };
    },
    handleMouseDown() {
      const pointer = this.getRelativePointerPos();
      if (!this.configKonva.draggable) {
        this.mCircleConfig.visible = true;
        this.mCircleConfig.startX = pointer.x;
        this.mCircleConfig.startY = pointer.y;
        this.mCircleConfig.x = this.mCircleConfig.startX;
        this.mCircleConfig.y = this.mCircleConfig.startY;
        this.mCircleConfig.radius = 0;
      }
      const insideRef = this.hiddenCross.isIn(pointer.x, pointer.y, 0);
      this.statusText =
        insideRef.name +
        " is " +
        (insideRef.isMarked() ? "marked" : "unmarked");
    },

    startCollapse() {
      //callback for drawing
      this.isRunning = true;
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
        const animationDuration = this.animationDuration;

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
        this.isRunning = false;
      }, this.animationDelayBuffer);
    },

    createMark() {
      const newCircle = this.createCircle(
        this.mCircleConfig.x,
        this.mCircleConfig.y,
        this.mCircleConfig.radius,
        this.mCircleConfig.strokeWidth
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
      this.list.push(newCross);
    },
    handleMouseUp() {
      this.animationDelayBuffer = 0;
      this.mCircleConfig.visible = false;
      if (this.mCircleConfig.radius > 1 / this.stage.scaleX()) {
        this.createMark();
      }
      this.hiddenCross.refresh(null);
      this.hiddenCross.isMarked(this.visualizeMarkedState);
    },

    visualizeMarkedState(markRef, marked) {
      markRef.data.strokeWidth = markRef.data.nativeStrokeWidth;
      if (marked) {
        markRef.data.strokeWidth *= 2;
      }
    },

    handleMouseMove() {
      const pointer = this.getRelativePointerPos();
      if (this.mCircleConfig.visible) {
        const dx = pointer.x - this.mCircleConfig.startX;
        const dy = pointer.y - this.mCircleConfig.startY;
        this.mCircleConfig.x = this.mCircleConfig.startX + dx / 2;
        this.mCircleConfig.y = this.mCircleConfig.startY + dy / 2;
        this.mCircleConfig.radius = Math.sqrt(dx * dx + dy * dy) / 2;
      } else {
        const insideRef = this.hiddenCross.isIn(pointer.x, pointer.y, 0);
        this.statusText =
          insideRef.name +
          " is " +
          (insideRef.isMarked(null) ? "marked" : "unmarked");
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
      this.handleMouseMove();
    },
    handleTouchStart(e) {
      e.evt.preventDefault();
      this.handleMouseDown();
    },
    handleTouchEnd() {
      this.handleMouseUp();
    },
    handleScroll(e) {
      const scaleBy = 1.01;

      const stage = this.$refs.stage.getNode();
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      var newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
      console.log(newScale);
      this.mCircleConfig.strokeWidth = 1 / newScale;
      this.mCircleConfig.dash = [4 / newScale, 4 / newScale];
    },
  },
  mounted() {
    this.hiddenCross = new Node(
      "Hidden Cross",
      this.createCircle(0, 0, Infinity),
      0
    );
    this.vue = this.$refs;
    document.addEventListener("scroll", this.handleScroll);
    this.stage = this.$refs.stage.getNode();
    console.log(this.stage);
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
