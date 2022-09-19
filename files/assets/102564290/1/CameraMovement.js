var CameraMovement = pc.createScript('cameraMovement');

CameraMovement.attributes.add('mouseSpeed', { type: 'number', default: 1.4, description: 'Mouse Sensitivity' });

// Called once after all resources are loaded and before the first update
CameraMovement.prototype.initialize = function () {
    this.eulers = new pc.Vec3();
    this.touchCoords = new pc.Vec2();

    this.cameraInputDown = false;

    var app = this.app;
    app.mouse.on("mousemove", this.onMouseMove, this);
    app.mouse.on("mousedown", this.onMouseDown, this);
    app.mouse.on("mouseup", this.onMouseUp, this);

    this.rayEnd = app.root.findByName('RaycastEndPoint');
    
    this.on('destroy', function() {
        app.mouse.off("mousemove", this.onMouseMove, this);
        app.mouse.off("mousedown", this.onMouseDown, this);
        app.mouse.off("mouseup", this.onMouseUp, this);
    }, this);
};
    
CameraMovement.prototype.postUpdate = function (dt) {
    if( this.app.som.playerInputFrozen ) {
        return;
    }

    var originEntity = this.entity.parent;
    
    var targetY = this.eulers.x + 180;
    var targetX = this.eulers.y;

    var targetAng = new pc.Vec3(-targetX, targetY, 0);
    
    originEntity.setEulerAngles(targetAng);
                   
    this.entity.setPosition(this.getWorldPoint());
    
    this.entity.lookAt(originEntity.getPosition());
};

CameraMovement.prototype.onMouseMove = function (e) {
    if( this.app.som.playerInputFrozen ) {
        return;
    }

    if (pc.Mouse.isPointerLocked()) {
        this.eulers.x -= ((this.mouseSpeed * e.dx) / 60) % 360;
        this.eulers.y += ((this.mouseSpeed * e.dy) / 60) % 360;

        if (this.eulers.x < 0) this.eulers.x += 360;
        if (this.eulers.y < 0) this.eulers.y += 360;
    }
    else if( this.cameraInputDown ) {
        this.eulers.x -= ((this.mouseSpeed * e.dx) / 60) % 360;
        this.eulers.y += ((this.mouseSpeed * e.dy) / 60) % 360;

        if (this.eulers.x < 0) this.eulers.x += 360;
        if (this.eulers.y < 0) this.eulers.y += 360;
    }
};

CameraMovement.prototype.onMouseDown = function (e) {
    if( this.app.som.playerInputFrozen ) {
        return;
    }

    this.cameraInputDown = true;
};

CameraMovement.prototype.onMouseUp = function (e) {
    if( this.app.som.playerInputFrozen ) {
        return;
    }
    
    this.cameraInputDown = false;
};

CameraMovement.prototype.getWorldPoint = function () {
    var from = this.entity.parent.getPosition(); 
    var to = this.rayEnd.getPosition();

    var hitPoint = to;

    var app = this.app;
    var hit = app.systems.rigidbody.raycastFirst(from, to);
    
    return hit ? hit.point : to;
};
