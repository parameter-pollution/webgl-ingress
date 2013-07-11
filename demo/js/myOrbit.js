
myOrbit = function ( camera, center, distance, clock ) {

	this.camera = camera;
	
	this.center = center;

	this.clock = clock;

	this.autoRotate = false;
	this.autoRotateSpeed = 0.2; //radiants per millisecond

	this.spherical = {};
	this.spherical.azimuth = 0;
	this.spherical.inclination = Math.PI/2;
	this.spherical.distance = distance;

	
	this.update = function () {
		
		if( this.autoRotate ){	
			this.spherical.azimuth += this.clock.getDelta() * this.autoRotateSpeed;
			this.fixAzimuth();
		}else{
			//update the clock, so we don't spin "silently" when autorotate is disabled
			this.clock.getDelta();
		}

    	this.camera.position=this.convertSphericalToCartesian(this.spherical);

    	this.camera.lookAt(this.center);

    	//update the matrix so we are working with the up-to-date values after this function has been called
      	this.camera.updateMatrixWorld();
	}

	this.fixAzimuth = function (){
		this.spherical.azimuth %= 2*Math.PI;
		if( this.spherical.azimuth < 0 ){ this.spherical.azimuth = 2*Math.PI + this.spherical.azimuth; }	
	}

	this.tween_to_orbit = function( targetOrbit, duration){

	    if( this.spherical.azimuth - targetOrbit.azimuth > Math.PI ){
	      targetOrbit.azimuth+=2*Math.PI;
	    }else if( targetOrbit.azimuth - this.spherical.azimuth > Math.PI ){
	      targetOrbit.azimuth= - (2*Math.PI - targetOrbit.azimuth );
	    }
	    var position_tween = new TWEEN.Tween(this.spherical).to( targetOrbit, duration);
	    position_tween.easing(TWEEN.Easing.Cubic.InOut);

	    position_tween.start();
    }

    //assumes origin is (0,0,0)
    this.convertCartesionToSpherical = function(point){
      var spherCor = {};
      spherCor.distance = Math.sqrt( point.x*point.x + point.y*point.y + point.z*point.z);
      spherCor.azimuth = Math.atan2( point.y , point.x );
      if( spherCor.azimuth < 0 ){ spherCor.azimuth = 2*Math.PI + spherCor.azimuth; }
      spherCor.inclination = Math.acos( point.z / spherCor.distance );
      return spherCor;
    }

    this.convertSphericalToCartesian = function(spherical){
    	var point={};
    	if( spherical.inclination )
    	point.x = spherical.distance * Math.sin( spherical.inclination ) * Math.cos( spherical.azimuth );
    	point.y = spherical.distance * Math.sin( spherical.inclination ) * Math.sin( spherical.azimuth );
    	point.z = spherical.distance * Math.cos( spherical.inclination );
    	return point;
    }

};
