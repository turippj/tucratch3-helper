import Vue from 'vue'
const { ipcRenderer } = require('electron');

let data = {
  selected: '',
  message: '',
  options: [],
  selectedChecker: false,
  validation: {
    valid: false
  }
};

new Vue({
  el: '#selectMenu',
  data: data,
  methods: {
    select: function (event) {
      if(!this.selectedChecker){
        ipcRenderer.send('selected', this.selected);
        this.selectedChecker = true;
        ipcRenderer.once('init', (event, res) => {
            data.message = 'せつぞくせいこう！';
        });
      }
    },

    refrash: function (event) {
      ipcRenderer.send('refrash', "Refrash, Please!");
      ipcRenderer.once('init', (event, res) => {
        data.message = 'こうしんせいこう！';
      });
    }
  }
});

ipcRenderer.on('list', (event, res) => {
  data.options = res;
  console.log("updated");
});
