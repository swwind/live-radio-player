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
    <input type="button" :disabled="!selecting" @click="moveUp(selecting)"
      class="fa-button" style="background-image: url(./svgs/solid/chevron-up.svg);">
    <input type="button" :disabled="!selecting" @click="moveDown(selecting)"
      class="fa-button" style="background-image: url(./svgs/solid/chevron-down.svg);">
    <input type="button" :disabled="!selecting" @click="selecting.show()"
      class="fa-button" style="background-image: url(./svgs/solid/cog.svg);">
    <input type="button" :disabled="!selecting" @click="removeComp(selecting)"
      class="fa-button" style="background-image: url(./svgs/solid/trash-alt.svg);">
  </div>
</div>