<div>
  <button class="ui labeled icon button" @click="handleSelectFiles">
    <i class="icon file"></i>
    Browse...
  </button>
  <button class="negative ui labeled icon button" @click="removeAll">
    <i class="icon delete"></i>
    Remove All
  </button>
  <div class="ui action input">
    <input type="number" placeholder="Netease Playlist id" v-model="playlist_id">
    <button class="ui button" @click="loadPlayList">Add</button>
  </div>
  <div class="play-list">
    <div v-for="item in Array.from(files)" :id="item[0]" class="item"
      :class="{ playing: item[0] === playing }" @click="playTrackFrom(item[0])">
      <span v-text="item[1].name"></span>
      <i class="delete icon right-float" @click="$event.stopPropagation(), removeTrack(item[0])"></i>
    </div>
  </div>
</div>