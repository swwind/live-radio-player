<div class="sub-window" v-show="show" :style="`top:${top}px;left:${left}px;`">
  <div class="sw-statebar">
    <span class="sw-title" v-text="title"></span>
    <span class="sw-close" @click="show = false">X</span>
  </div>
  <div class="sw-container">
    <div v-for="cfg in configs">
      <span v-text="cfg.name + ': '"></span>
      <input v-if="cfg.type === 'string'" type="string"
        @input="change(cfg.name, $event.target.value);" :value="cfg.default">
      <input v-if="cfg.type === 'number'" type="number"
        @input="change(cfg.name, $event.target.value);" :value="cfg.default">
    </div>
  </div>
</div>