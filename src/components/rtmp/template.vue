<div class="rtmp-configs">
  <input type="text" placeholder="rtmp://..." v-model="server" :disabled="living">
  <input type="number" placeholder="fps" v-model="fps" :disabled="living">
  <input type="number" placeholder="video bits" v-model="vbits" :disabled="living">
  <input type="number" placeholder="audio bits" v-model="abits" :disabled="living">
  <input type="button" @click="handleClick" :value="living ? 'Stop' : 'Start'">
</div>