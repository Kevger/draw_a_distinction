<template>
  <div v-resize="handleResize" ref="stageContainer" style="position: relative">
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
            dash: item.data.dash,
          }"
        />
        <v-text
          v-for="item in variablesList"
          ref="variables"
          :key="item.data.id"
          :config="{
            x: item.data.x - item.data.radius,
            y: item.data.y - item.data.radius,
            text: item.data.text,
            fontSize: item.data.fontSize,
            width: item.data.width,
            height: item.data.height,
            visible: item.data.visible,
            align: item.data.align,
            verticalAlign: item.data.verticalAlign,
            strokeWidth: item.data.strokeWidth,
            id: item.data.id,
            opacity: item.data.opacity,
          }"
        />
        <v-circle ref="mCircle" :config="mCircleConfig" />
        <v-text ref="mText" :config="mTextConfig" />
      </v-layer>
    </v-stage>

    <v-menu
      v-model="active_menu"
      :close-on-content-click="false"
      :close-on-click="false"
      :nudge-width="145"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-hover>
          <v-chip
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 5 : 2}`"
            style="position: absolute; top: 1%; left: 1%"
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
            padding-top: 2%;
          "
          >Laws of Form</v-card-title
        >
        <v-card-subtitle
          style="
            padding-left: 2%;
            padding-right: 2%;
            padding-bottom: 1%;
            padding-top: 3%;
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
                thumb-label
                thumb-color="light-grey"
                hide-details
                step="0.2"
                label="Delay"
                append-icon="mdi-metronome"
                :disabled="isRunning"
              ></v-slider>
            </v-col>
          </v-row>
          <v-row no-gutters style="margin-top: 3%">
            <v-card-actions class="ma-0 pa-0">
              <v-btn
                v-model="isRunning"
                :color="isRunning ? 'secondary' : 'primary'"
                @click="startCollapse"
                tile
              >
                <v-icon>mdi-play</v-icon>run
              </v-btn>
              <v-btn
                v-model="configKonva.draggable"
                :color="configKonva.draggable ? 'secondary' : 'primary'"
                value="false"
                @click="configKonva.draggable = !configKonva.draggable"
                hide-details
                tile
              >
                <v-icon small>mdi-cursor-pointer</v-icon>Move
              </v-btn>
              <v-btn
                v-model="activeVisualizeMarkedState"
                :color="activeVisualizeMarkedState ? 'secondary' : 'primary'"
                value="false"
                @click="
                  activeVisualizeMarkedState = !activeVisualizeMarkedState
                "
                hide-details
                :disabled="isRunning"
                tile
                style="font-size: 76%"
              >
                <v-icon small>mdi-chart-donut</v-icon>Show
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-row no-gutters style="margin-top: 3%">
            <v-card-actions class="ma-0 pa-0">
              <v-btn
                tile
                v-for="item in this.variables"
                :key="item.name"
                :color="
                  activeVariableCreation == item.name ? 'secondary' : 'primary'
                "
                @click="
                  activeVariableCreation =
                    activeVariableCreation != item.name ? item.name : null
                "
              >
                {{ item.name }}
                <v-switch
                  @click="variablesChanged = !variablesChanged"
                  v-model="item.value"
                />
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-card>
    </v-menu>
    <v-chip
      color="primary"
      style="
        position: absolute;
        left: 1%;
        bottom: 1%;
        padding-left: 1%;
        padding-right: 1%;
        padding-bottom: 0.5%;
        padding-top: 0.5%;
      "
      text-color="white"
      label
      :class="`elevation-2`"
    >
      <v-icon v-if="isRunning">{{
        statusOperation == "crossing"
          ? "mdi-circle-double"
          : "mdi-circle-multiple-outline"
      }}</v-icon>
      {{ isRunning ? statusOperation : statusText }}
    </v-chip>

    <v-menu
      v-model="active_logic_table"
      :close-on-content-click="true"
      :close-on-click="false"
      :nudge-width="155"
      :offset-y="true"
      top
    >
      <template v-slot:activator="{ on }">
        <v-hover>
          <v-btn
            small
            @click="openLogicTable"
            color="primary"
            style="position: absolute; bottom: 1%; right: 1%"
            v-on="on"
          >
            <v-icon> mdi-gate-xor</v-icon>
          </v-btn>
        </v-hover>
      </template>
      <v-card
        color="rgb(0,0,0,0.5)"
        style="
          padding-left: 0%;
          padding-right: 0%;
          padding-bottom: 0%;
          padding-top: 0%;
        "
      >
        <v-card-title>Logic table</v-card-title>
        <v-card-subtitle small>Logics of LoF</v-card-subtitle>
        <v-data-table
          style="
            padding-left: 0%;
            padding-right: 0%;
            padding-bottom: 0%;
            padding-top: 0%;
          "
          dense
          color="primary"
          :headers="this.logicTable.headers"
          :items="this.logicTable.states"
          hide-default-footer
          item-key="name"
          class="elevation-5"
        >
        </v-data-table>
      </v-card>
    </v-menu>
  </div>
</template>





<script>
import Cross, { Variable } from "../plugins/tree";

const width = window.innerWidth;
const height = window.innerHeight;
export default {
  name: "Space",
  watch: {
    activeVisualizeMarkedState() {
      this.unwrittenCross.isMarked(this.visualizeMarkedState);
    },

    variablesChanged() {
      this.updateVariables();
      this.unwrittenCross.isMarked(this.visualizeMarkedState);
    },
  },
  data() {
    return {
      statusOperation: "",
      statusText: "",
      activeVariableCreation: null,
      unwrittenCross: null,
      list: [],
      variablesList: [],
      variables: [
        { name: "X", value: false, active: 0 },
        { name: "Y", value: false, active: 0 },
        { name: "Z", value: false, active: 0 },
      ],
      variablesChanged: false,
      idCnt: 0, //mark id
      vidCnt: 10000000, // variable id - so that idCnt (marks) and vidCnt will not have the same values
      activeVisualizeMarkedState: true,
      active_menu: true,
      isRunning: false,
      active_logic_table: false,
      logicTable: {},
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
      mTextConfig: {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        text: "",
        strokeWidth: 1,
        visible: false,
        align: "center",
        verticalAlign: "middle",
        width: 20,
        height: 20,

        fontSize: 1,
      },
      configKonva: {
        width: width,
        height: height,
        draggable: false,
      },
      animationDuration: 1,
      animationDelayBuffer: 0,
      width: window.innerHeight,
      height: window.innerHeight,
      vue: null,
      stage: null,
      touchLastCenter: null,
      touchLastDist: 0,
      blockOtherMessages: false,
    };
  },
  methods: {
    openLogicTable() {
      this.calculateLogicTable();
    },
    createVariable(x, y, text, fontSize, width, height, radius, strokeWidth) {
      const newVariable = {
        x: x,
        y: y,
        text: text,
        fontSize: fontSize,
        width: width,
        height: height,
        visible: true,
        align: "center",
        verticalAlign: "middle",
        strokeWidth: strokeWidth,
        id: this.vidCnt++,
        radius: radius,
        dash: [2, 2],
        markedForDeletion: false,
        opacity: 0,
      };
      return newVariable;
    },
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
        dash: null,
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
        // dash and strokewidth are dummy values because mouesmove will change them dynamically
        this.mCircleConfig.strokeWidth = 1 / this.stage.scaleX();
        this.mCircleConfig.dash = [1, 1];
        this.mCircleConfig.visible = true;
        this.mCircleConfig.startX = pointer.x;
        this.mCircleConfig.startY = pointer.y;
        this.mCircleConfig.x = this.mCircleConfig.startX;
        this.mCircleConfig.y = this.mCircleConfig.startY;
        this.mCircleConfig.radius = 0;

        if (this.activeVariableCreation) {
          this.mTextConfig.visible = true;
          this.mTextConfig.text = this.activeVariableCreation;
          this.mTextConfig.startX = this.mCircleConfig.startX;
          this.mTextConfig.startY = this.mCircleConfig.startY;
          this.mTextConfig.x = this.mCircleConfig.x;
          this.mTextConfig.y = this.mCircleConfig.y;
          this.mTextConfig.fontSize = this.mCircleConfig.radius;
        }

        // draw bounding circles of variables during drawing
        for (let i = 0; i < this.variablesList.length; ++i) {
          const variable = this.variablesList[i];
          const variableCollsionCircle = this.createCircle(
            variable.data.x,
            variable.data.y,
            variable.data.radius,
            variable.data.strokeWidth
          );
          variableCollsionCircle.markedForDeletion = true; //important or else an memory leak happens
          variableCollsionCircle.dash = [
            variable.data.strokeWidth,
            variable.data.strokeWidth * 3,
          ];
          const variableCollisionMark = new Cross(
            "dummy variable circle: " + variable.name,
            variableCollsionCircle
          );
          // temporary push them to the mark list, so that they are drawn reactivly
          // they dont have a parent, thus they dont get attention from the unwritten cross
          // because markedForDeletion is true, they will be deleted after the mouse is released
          this.list.push(variableCollisionMark);
        }
      }

      //reference of cross u clicked into (the unwritten cross extends indefinetly)
      const insideRef = this.unwrittenCross.isIn(pointer.x, pointer.y, 0);
      this.printStatusMessage(
        insideRef.name + " is " + (insideRef.isMarked() ? "marked" : "unmarked")
      );
    },

    startCollapse() {
      //callback for drawing
      this.isRunning = true;
      this.unwrittenCross.markCollapse((child, endstate, other) => {
        //get reference to circle which has to be moved
        let ref = null;
        if (!child) {
          console.error("Child not defined!" + child);
          console.error(endstate);
          console.error(other);
        }
        if (child.constructor.name === "Variable") {
          // Handle variables through a different array
          for (let i = 0; i < this.vue.variables.length; ++i) {
            const tmpRef = this.vue.variables[i].getNode();
            if (tmpRef.attrs.id == child.data.id) {
              ref = tmpRef;
              //mark for later deletion
              child.data.markedForDeletion = true;
              break;
            }
          }
        } else {
          for (let i = 0; i < this.vue.circles.length; ++i) {
            const tmpRef = this.vue.circles[i].getNode();
            if (tmpRef.attrs.id == child.data.id) {
              ref = tmpRef;
              //mark for later deletion
              child.data.markedForDeletion = true;
              break;
            }
          }
        }
        if (!ref) {
          console.error("Error ref not found!");
          console.error(child);
          return;
        }
        let thisOperation = "calling";
        if (other !== null) {
          //in case of recrossing delete also the other circle
          other.data.markedForDeletion = true;
          thisOperation = "crossing";
        }

        /*
        play animations for x seconds one after another, 
        every time this function is called a
        animationduration is added
        */
        const animationDuration = this.animationDuration;

        setTimeout(() => {
          //start animation
          if (child.constructor.name === "Variable") {
            if (!endstate) {
              //Variable disapearing
              ref.to({
                x: child.data.x,
                y: child.data.y,
                radius: 0,
                width: 0,
                height: 0,
                fontSize: 0,
                duration: animationDuration,
                onFinish: () => {
                  child.data.visible = false;
                  if (other !== null) {
                    other.data.visible = false;
                  }
                },
              });
            } else {
              //Variable for calling and crossing
              ref.to({
                x: endstate.x - endstate.radius,
                y: endstate.y - endstate.radius,
                radius: endstate.radius,
                width: endstate.radius * 2,
                height: endstate.radius * 2.3,
                fontSize: endstate.radius * 2,
                duration: animationDuration,
                onFinish: () => {
                  child.data.visible = false;
                  if (other !== null) {
                    other.data.visible = false;
                  }
                },
              });
            }
            //default crosses
          } else {
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
          }
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
        this.animationDelayBuffer = 0;
      }, this.animationDelayBuffer);
    },
    // Creates a notification text and blocks the other messages from being displayed
    createNotification(text, time = 1000) {
      this.blockOtherMessages = true;
      this.statusText = text;
      setTimeout(() => {
        this.blockOtherMessages = false;
      }, time);
    },
    // prints a status message
    printStatusMessage(text) {
      if (!this.blockOtherMessages) this.statusText = text;
    },
    createCross() {
      //get mark in which the new variable or mark is inn
      const insideRef = this.unwrittenCross.isIn(
        this.mCircleConfig.x,
        this.mCircleConfig.y,
        this.mCircleConfig.radius
      );

      if (insideRef.constructor.name === "Variable") {
        //Creation inside a variable is not allowed
        this.createNotification("Creation inside a variable is not allowed");
        return;
      }

      //Creating the new child
      let newCross = null;
      if (this.activeVariableCreation) {
        const newVariable = this.createVariable(
          this.mTextConfig.x + this.mTextConfig.radius,
          this.mTextConfig.y + this.mTextConfig.radius,
          this.mTextConfig.text,
          this.mTextConfig.fontSize,
          this.mTextConfig.width,
          this.mTextConfig.height,
          this.mCircleConfig.radius,
          this.mCircleConfig.strokeWidth
        );
        newCross = new Variable(
          "V " + insideRef.name + " " + insideRef.childs.length,
          newVariable
        );
      } else {
        const newCircle = this.createCircle(
          this.mCircleConfig.x,
          this.mCircleConfig.y,
          this.mCircleConfig.radius,
          this.mCircleConfig.strokeWidth
        );
        newCross = new Cross(
          insideRef.name + " " + insideRef.childs.length,
          newCircle
        );
      }

      //pre calculations for collision check
      const dx = newCross.data.x - insideRef.data.x;
      const dy = newCross.data.y - insideRef.data.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      //checking if collision happens because of strokewidth
      const ncsw = newCross.data.strokeWidth / 2;
      const irsw = insideRef.data.strokeWidth / 2;

      if (
        !(
          d + newCross.data.radius + ncsw < insideRef.data.radius - irsw ||
          d > newCross.data.radius + ncsw + insideRef.data.radius + irsw
        )
      ) {
        this.createNotification("Intersection of crosses not allowed");
        return;
      }
      // check if another cross inside this cross in inside the new cross
      let insideChilds = [];
      for (let i = 0; i < insideRef.childs.length; ++i) {
        const child = insideRef.childs[i];
        const dx = newCross.data.x - child.data.x;
        const dy = newCross.data.y - child.data.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const csw = child.data.strokeWidth / 2;

        if (d + child.data.radius + csw < newCross.data.radius - ncsw) {
          if (this.activeVariableCreation) {
            this.createNotification("variables can not hold marks");
            return false;
          }
          insideChilds.push(child);
        } else if (d > child.data.radius + csw + newCross.data.radius + ncsw) {
          continue;
        } else {
          this.createNotification("Intersection of crosses not allowed");
          return false;
        }
      }
      if (!this.activeVariableCreation) {
        newCross.childs = insideChilds;
        const notFiltered = insideRef.childs.filter(
          (a) => !insideChilds.includes(a)
        );
        insideRef.childs = notFiltered;
        insideRef.childs.push(newCross);
        this.list.push(newCross);
      } else {
        insideRef.childs.push(newCross);
        this.variablesList.push(newCross);
        this.updateVariables();
      }
      // refresh logic table if open
      if (this.active_logic_table) {
        this.calculateLogicTable();
      }
    },
    handleMouseUp() {
      this.animationDelayBuffer = 0;
      this.mCircleConfig.visible = false;
      this.mTextConfig.visible = false;
      if (this.mCircleConfig.radius > 1 / this.stage.scaleX()) {
        this.createCross();
      }
      this.deleteItems();
      this.unwrittenCross.refresh(null);
      this.unwrittenCross.isMarked(this.visualizeMarkedState);
    },

    visualizeMarkedState(markRef, marked) {
      if (markRef.constructor.name === "Variable") {
        if (marked) {
          markRef.data.opacity = 0.5;
        } else {
          markRef.data.opacity = 1;
        }
      } else if (marked && this.activeVisualizeMarkedState) {
        const newDashSize = 2 * markRef.data.strokeWidth;
        markRef.data.dash = [newDashSize, newDashSize];
      } else {
        markRef.data.dash = null;
      }
    },

    updateVariables() {
      // reset and count number of actives variables (used for creating the logic table)
      this.variables.forEach((e) => (e.active = 0));
      //set the state of each specific variable depending on the global variable state
      for (let i = 0; i < this.variablesList.length; ++i) {
        const variable = this.variablesList[i];
        const variableState = this.variables.find(
          (e) => e.name === variable.data.text
        );
        if (typeof variableState === "undefined") {
          console.error("Error unknow variable name");
          console.error(variable);
          console.error(this.variables);
        }
        variableState.active += 1;
        variable.marked = !variableState.value;
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
        this.mCircleConfig.strokeWidth = this.mCircleConfig.radius / 50;
        this.mCircleConfig.dash = [
          this.mCircleConfig.strokeWidth * 4,
          4 / this.stage.scaleX(),
        ];
        if (this.activeVariableCreation) {
          this.mTextConfig.radius = this.mCircleConfig.radius;
          this.mTextConfig.width = this.mCircleConfig.radius * 2;
          this.mTextConfig.height = this.mCircleConfig.radius * 2.3; //trial and error
          this.mTextConfig.fontSize = this.mCircleConfig.radius * 2;
          this.mTextConfig.x = this.mCircleConfig.x - this.mCircleConfig.radius;
          this.mTextConfig.y = this.mCircleConfig.y - this.mCircleConfig.radius;
        }
      } else {
        const insideRef = this.unwrittenCross.isIn(pointer.x, pointer.y, 0);

        this.printStatusMessage(
          insideRef.name +
            " is " +
            (insideRef.isMarked(null) ? "marked" : "unmarked")
        );
      }
    },

    calculateLogicTable() {
      this.updateVariables();
      const safedVariables = JSON.parse(JSON.stringify(this.variables));

      //build header from used variables
      const headers = [];
      this.variables.forEach((e) =>
        e.active > 0
          ? headers.push({
              data: e,
              text: e.name,
              value: e.name,
              active: e.active,
            })
          : null
      );
      const states = [];
      const numStates = 1 << headers.length; //2^variable states - because of unmarked & marked value

      //wtf am i doing here - there must be a smarter way to generate truth tables
      for (let i = 0; i < numStates; ++i) {
        const newEntry = {}; //lets build our row
        const bitPattern = i;
        for (let e = 0; e < headers.length; ++e) {
          const specificBit = 1 << e;
          // bit set?
          if (specificBit & bitPattern) {
            headers[e].data.value = true;
            newEntry[headers[e].value] = true;
          } else {
            headers[e].data.value = false;
            newEntry[headers[e].value] = false;
          }
        }
        this.updateVariables();
        newEntry["U"] = this.unwrittenCross.isMarked(null);
        states.push(newEntry);
      }
      headers.push({ text: "Unwritten Cross", value: "U" });
      this.logicTable = { headers: headers, states: states };
      this.variables = safedVariables;
      this.updateVariables();
    },

    deleteItems() {
      for (let i = 0; i < this.list.length; ++i) {
        if (this.list[i].data.markedForDeletion) {
          this.$delete(this.list, i);
          --i;
        }
      }
      for (let i = 0; i < this.variablesList.length; ++i) {
        if (this.variablesList[i].data.markedForDeletion) {
          this.$delete(this.variablesList, i);
          --i;
        }
      }

      //// right now we delete after all operations happend, normally only a single state should be left
      //if (this.variablesList.length + this.list.length > 1) {
      //  console.error("Memory leak! More than one variable left!");
      //  console.error(this.variablesList);
      //  console.error(this.list);
      //}
      this.unwrittenCross.refresh(null);
      // refresh logic table if open
      if (this.active_logic_table) {
        this.calculateLogicTable();
      }
    },

    handleTouchMove(e) {
      e.evt.preventDefault();

      const getDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };
      const getCenter = (p1, p2) => {
        return {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };
      };
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (this.stage.isDragging()) {
          this.stage.stopDrag();
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!this.touchLastCenter) {
          this.touchLastCenter = getCenter(p1, p2);
          return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!this.touchLastDist) {
          this.touchLastDist = dist;
        }
        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
          y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
        };

        var scale = this.stage.scaleX() * (dist / this.touchLastDist);

        this.stage.scale({ x: scale, y: scale });

        // calculate new position of the stage
        var dx = newCenter.x - this.touchLastCenter.x;
        var dy = newCenter.y - this.touchLastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        this.stage.position(newPos);
        this.stage.batchDraw();

        this.touchLastDist = dist;
        this.touchLastCenter = newCenter;
      } else {
        this.handleMouseMove();
      }
    },
    handleTouchStart(e) {
      e.evt.preventDefault();
      //normal blur event doesnt occur if touch is used
      //thus send it here, to close the second menu automatically if its opened
      this.$emit("blur");
      this.touchLastDist = 0;
      this.touchLastCenter = null;
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
    },
    handleResize() {
      if (this.stage) {
        /*The value of konfigKonva and dummyValue doesnt 
        matter since we are scaling relativly
        to the parent container*/
        //get parent container
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // scale relativly to parent
        let usedScale = this.width / 1000;

        if (this.height != newHeight) {
          this.height = newHeight;
          usedScale = this.height / 1000;
        }

        if (this.width != newWidth) {
          this.width = newWidth;
          usedScale = this.width / 1000;
        }

        this.stage.width(this.width);
        this.stage.height(this.height);
        //dont use different scales for x and y or else everything will be eliptic
        this.stage.scale({ x: usedScale, y: usedScale });
        this.stage.draw();
      }
    },
    handleOrientationChange() {
      //switch innerheight and innerwidth with the handler, because inside
      //resize event its somehow not properly detected :/
      const tmp = window.innerHeight;
      window.innerHeight = window.innerWidth;
      window.innerWidth = tmp;
    },
  },
  mounted() {
    this.unwrittenCross = new Cross(
      "unwritten cross",
      this.createCircle(0, 0, Infinity),
      0
    );
    this.vue = this.$refs;
    document.addEventListener("scroll", this.handleScroll);
    window.addEventListener("orientationchange", this.handleOrientationChange);
    this.stage = this.$refs.stage.getNode();
    this.handleResize();
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
