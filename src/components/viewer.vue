<div>
  <input type="button" value="+ Spectrum" @click="addNewComp('Spectrum')">
  <input type="button" value="+ Image" @click="addNewComp('Image')">
  <input type="button" value="+ Text" @click="addNewComp('Text')">
  <div class="effect-list">
    <div v-for="item in comps" @click="selecting = item" class="list-item"
      :class="{ selected: item === selecting }">
      <span v-text="item.type" class="effect-type"></span>
      <span v-text="item.name"></span>
    </div>
  </div>
  <div class="buttons">
    <input type="button" value="Move Up" @click="moveUp(selecting)" :disabled="!selecting">
    <input type="button" value="Move Down" @click="moveDown(selecting)" :disabled="!selecting">
    <input type="button" value="Config" @click="selecting.show()" :disabled="!selecting">
    <input type="button" value="Remove" @click="removeComp(selecting)" :disabled="!selecting">
  </div>
</div>