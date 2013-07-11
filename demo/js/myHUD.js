//TODO: allow multiple trackers in one hud???

myHUD = function ( camera, distance ) {

	this.camera = camera;
	this.distance = distance;

	//calculating plane size to "block" the whole view
	//this assumes the camera is a perspective camera!!!!
	var height=2 * Math.tan( (this.camera.fov/2)/180*Math.PI ) * this.distance;
	var width= this.camera.aspect * height;
	this.hudGeometry = new THREE.PlaneGeometry(  width , height );
	this.hudMaterial = new THREE.MeshBasicMaterial(); 
	this.hud = new THREE.Mesh(this.hudGeometry, this.hudMaterial);
	this.hud.position.set( 0,0, distance * (-1) );
	this.hud.visible=false;

	this.camera.add(this.hud);
	this.tracker={};
	this.trackingPoint=new THREE.Vector3(0,0,0);

	this.hudRaycaster = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) , new Number(hud_distance-0.01), new Number(hud_distance+1.5)  );

	this.addTracked = function (tracker) {
		this.add(tracker);
		this.tracker = tracker;
	};

	this.add = function (obj) {
		this.hud.add(obj);
		obj.visible=true;
	}

	this.updateTrackingPoint = function( trackingPoint ){
		this.trackingPoint = trackingPoint;
	}

	this.update = function(){
		var tmptrackingPoint = new THREE.Vector3( this.trackingPoint.x, this.trackingPoint.y, this.trackingPoint.z);
        this.hudRaycaster.set(this.camera.position, tmptrackingPoint.sub( this.camera.position ).normalize());
        var intersection=this.hudRaycaster.intersectObject(this.hud);
        if( intersection.length > 0 ){
			var vector = intersection[0].point.clone();
			this.camera.worldToLocal( vector );
			this.tracker.position.x=vector.x;
			this.tracker.position.y=vector.y;
        }else{
          //console.log("no intersection point with HUD plane, WTF???");
        }
	}

};