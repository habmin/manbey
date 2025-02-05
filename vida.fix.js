p5.prototype.Vida.prototype.removeActiveZone = function(_id) {
    for(var i = this.activeZones.length - 1; i >= 0; i--) {
      if(_id == this.activeZones[i].id) this.activeZones.splice(i, 1);
    }
  }