<div>
  <div class="ui input">
    <input type="file" multiple accept="audio/*"
      @change="addTrackFromFiles($event.target.files)">
  </div>
  <div class="ui action input">
    <input type="number" placeholder="Netease Playlist id" v-model="playlist_id">
    <button class="ui button" @click="loadPlayList">Add</button>
  </div>
  <button class="ui button" @click="removeAll">Remove All</button>
  <div class="play-list">
    <div v-for="item in Array.from(files)" :id="item[0]" class="item"
      :class="{ playing: item[0] === playing }" @click="playTrackFrom(item[0])">
      <span v-text="item[1].name"></span>
      <i class="delete icon right-float" @click="$event.stopPropagation(), removeTrack(item[0])"></i>
    </div>
  </div>
</div>