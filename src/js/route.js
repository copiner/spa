function History() {
    this.history = [];
    this.index = null;
}

History.prototype = {
  pushState: function (str) {
      if (this.index !== null) {
          var len = this.history.length;
          var nextIndex = this.index + 1;
          this.history.splice(nextIndex, this.len - nextIndex, str);
          this.index = nextIndex;
      } else {
          this.history.push(str);
          this.index = 0;
      }

      return str;
  },
  replaceState: function (str) {
      if (this.index) {
          this.history.splice(this.index, 1, str);
      } else {
          this.history.push(str);
          this.index = 0;
      }
      return str;
  },
  back: function () {
      if (this.index === null) return "";
      return this.history[this.index === 0 ? 0 : --this.index];
  },
  forward: function () {
      if (this.index === null) return "";
      var len = this.history.length;
      return this.history[this.index === len - 1 ? len - 1 : ++this.index];
  },
  getSurround: function () {
      var len = this.history.length;
      if (this.index === null) {
          return {
              next: "",
              prev: ""
          };
      } else if (this.history.length === 1) {
          return {
              next: "",
              prev: ""
          };
      } else if (this.index === 0) {
          return {
              next: this.history[1],
              prev: ""
          };
      } else if (this.index === len - 1) {
          return {
              next: "",
              prev: this.history[len - 2]
          }
      } else {
          return {
              next: this.history[this.index + 1],
              prev: this.history[this.index - 1]
          }
      }
  }
}
