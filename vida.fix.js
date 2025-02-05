p5.prototype.Vida.prototype.removeActiveZone = function(t) {
    for (var s = this.activeZones.length - 1; s >= 0; s--) t == this.activeZones[s].id && this.activeZones.splice(s, 1)
  }