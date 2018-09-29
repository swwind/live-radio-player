<div>
  <input type="number" placeholder="width" v-model.number="rstx" :disabled="living" @input="handleResize">
  <input type="number" placeholder="height" v-model.number="rsty" :disabled="living" @input="handleResize">
  <input type="text" placeholder="rtmp://..." v-model="server" :disabled="living">
  <input type="number" placeholder="fps" v-model.number="fps" :disabled="living">
  <input type="number" placeholder="video bits" v-model.number="vbits" :disabled="living">
  <input type="number" placeholder="audio bits" v-model.number="abits" :disabled="living">
  <input type="button" @click="handleClick" :value="living ? 'Stop' : 'Start'">
</div>