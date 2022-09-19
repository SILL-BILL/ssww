var SomSim = pc.createScript('somSim');

SomSim.prototype.initialize = function() {
    var app = this.app;
    if( app.hasOwnProperty('som') ) {
        return;
    }

    app.som = this;
    this.isSomnium = false;
    this.player = null;
    this.playerInputFrozen = false;
};

SomSim.prototype.postInitialize = function() {
    if( this.app.som.isSomnium ) {
        return;
    }

    this.player = this.entity.parent.findByName('LocalPlayerSimulator');
    this.player.enabled = true;

    var spawnpoints = this.app.root.children[0].findByTag("playerspawn");
    if( spawnpoints.length > 0 ) {
        var spawnpoint = spawnpoints[Math.floor(Math.random()*spawnpoints.length)];
        this.player.rigidbody.teleport(spawnpoint.getPosition().clone(), spawnpoint.getEulerAngles().clone());
    }
    setTimeout(function() {
        this.app.som.fire('player:joinWorld');
    }.bind(this), 1000);
};

SomSim.prototype.webWorldInit = function(worldConfig) {
    return new Promise(function(resolve, reject) {
        var entity = this.entity.findByName('Augment Platform Prefab');
        entity.enabled = (worldConfig.type != 0);
        resolve({
            success: true
        });
    }.bind(this));
};

SomSim.prototype.setPlayerInputFrozen = function(val) {
    this.playerInputFrozen = val;
};