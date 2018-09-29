<div>
  <div class="ui buttons">
    <button class="ui button" @click="addNewComp('Spectrum')">Spectrum</button>
    <button class="ui button" @click="addNewComp('Image')">Image</button>
    <button class="ui button" @click="addNewComp('Text')">Text</button>
  </div>
  <div class="effect-list" @click="selecting = null">
    <div v-for="item in comps" @click="$event.stopPropagation(), selecting = item"
      class="item" :class="{ selected: item === selecting }">
      <span v-text="item.type" class="effect-type"></span>
      <span v-text="item.name"></span>
    </div>
  </div>
  <button class="circular ui icon button" :disabled="!selecting" @click="moveUp(selecting)">
    <i class="icon chevron up"></i>
  </button>
  <button class="circular ui icon button" :disabled="!selecting" @click="moveDown(selecting)">
    <i class="icon chevron down"></i>
  </button>
  <button class="circular ui icon button" :disabled="!selecting" @click="selecting.show()">
    <i class="icon cog"></i>
  </button>
  <button class="circular ui icon button" :disabled="!selecting" @click="removeComp(selecting)">
    <i class="icon trash alternate"></i>
  </button>
</div>