<div id="play-list">
  <input type="file" multiple="multiple" id="add-music" accept="audio/*"
    @change="addTrackFromFiles($event.target.files)">
  <input type="number" placeholder="Netease Playlist id" value="737739259"
    @keydown.enter="loadNetEaseCloudMusicPlayList($event.target.value)">
  <input type="button" value="remove all" @click="removeAll()">
  <div class="play-list">
    <div v-for="item in Array.from(files)" :id="item[0]" class="list-item"
      :class="{ playing: item[0] === playing }">
      <span class="span-button flex1" :title="item[1].name"
        v-text="item[1].name" @click="playTrackFrom(item[0])"></span>
      <span class="span-button" title="remove"
        @click="removeTrack(item[0])">x</span>
    </div>
  </div>
</div>