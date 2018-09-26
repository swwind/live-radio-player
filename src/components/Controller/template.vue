<div class="sub-window" v-show="show" :style="{ top: top + 'px', left: left + 'px' }"
  :class="{ moving: draging }">
  <div class="sw-statebar">
    <span class="sw-title" v-text="title" @mouseleave="draging = false"
      @mousedown="draging = true" @mouseup="draging = false"
      @mousemove="draging && (top += $event.movementY, left += $event.movementX)"></span>
    <span class="sw-close" @click="show = false">X</span>
  </div>
  <div class="sw-container">
    <div v-for="cfg in configs" :class="'c-' + cfg.type">
      <span v-text="cfg.name + ':'"></span>
      <input v-if="cfg.type === 'string'" type="text"
        @input="change(cfg.name, $event.target.value)" :value="values.get(cfg.name)">
      <input v-if="cfg.type === 'number'" type="number"
        @input="change(cfg.name, + $event.target.value)" :value="values.get(cfg.name)">
      <input v-if="cfg.type === 'color'" type="color"
        @input="change(cfg.name, $event.target.value)" :value="values.get(cfg.name)">
      <input v-if="cfg.type === 'checkbox'" type="checkbox"
        @change="change(cfg.name, $event.target.checked)" :checked="values.get(cfg.name)">
      <textarea v-if="cfg.type === 'multistring'" v-text="values.get(cfg.name)"
        @input="change(cfg.name, $event.target.value)">
      </textarea>
      <select v-if="cfg.type === 'select'" @input="change(cfg.name, cfg.options[$event.target.selectedIndex])">
        <option v-for="item in cfg.options" v-text="item" :selected="item === values.get(cfg.name)"></option>
      </select>
    </div>
  </div>
</div>