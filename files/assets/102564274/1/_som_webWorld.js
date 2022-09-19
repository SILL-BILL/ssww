var SomWebWorld = pc.createScript('_som_webWorld');
SomWebWorld.attributes.add('type', {
    title: 'World Type',
    description: 'Control how visitors load into your world. Augment Worlds get ADDED to the regular parcel build. Holistic Worlds REPLACE the regular parcel build.',
    type: 'number',
    enum: [
        { 'Holistic World': 0 },
        { 'Augment World': 1 }
    ],
    default: 0
});

SomWebWorld.attributes.add('allowedParcels', {
    title: 'Allowed Parcels',
    type: 'number',
    array: true,
    description: 'Explicitly list which PARCEL IDs that Somnium Space Web is allowed to use this world on. Leave blank to allow ANY parcel to use this world.'
});

SomWebWorld.prototype.postInitialize = function() {
    var worldConfig = {
        id: this.id,
        title: this.title,
        url: this.url,
        type: this.type,
        allowEverywhere: this.allowEverywhere,
        allowedParcels: this.allowedParcels,
        worldMixing: this.worldMixing,
        mixWorlds: this.mixWorlds,
        apiVersion: this.apiVersion
    };

    var entities;
    if( !this.app.som.isSomnium ) {
        entities = this.app.root.children[0].findByTag('disableIfNotSom');
        for( var i = 0; i < entities.length; i++ ) {
            entities[i].enabled = false;
        }
        entities = this.app.root.children[0].findByTag('enableIfNotSom');
        for( var i = 0; i < entities.length; i++ ) {
            entities[i].enabled = true;
        }
    }
    else {
        entities = this.app.root.children[0].findByTag('disableIfSom');
        for( var i = 0; i < entities.length; i++ ) {
            entities[i].enabled = false;
        }
        entities = this.app.root.children[0].findByTag('enableIfSom');
        for( var i = 0; i < entities.length; i++ ) {
            entities[i].enabled = true;
        }
    }
    
    this.app.som.webWorldInit(worldConfig).then((response) => {
        if( response.success ) {
            console.log('Web World Initialized');
        }
        else {
            console.log(response.errorMessage);
        }
    });
};