<div>
  <input type="string" placeholder="rtmp://..." v-model="server">
  <input type="number" placeholder="fps" v-model="fps">
  <input type="number" placeholder="video bits" v-model="vbits">
  <input type="number" placeholder="audio bits" v-model="abits">
  <input type="button" @click="handleClick" :value="living ? 'Stop' : 'Start'">
</div>