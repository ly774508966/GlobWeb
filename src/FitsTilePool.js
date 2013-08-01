/***************************************
 * Copyright 2011, 2012 GlobWeb contributors.
 *
 * This file is part of GlobWeb.
 *
 * GlobWeb is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, version 3 of the License, or
 * (at your option) any later version.
 *
 * GlobWeb is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GlobWeb. If not, see <http://www.gnu.org/licenses/>.
 ***************************************/

 define(function() {

/**************************************************************************************************************/

/** 
	TODO : specify more TilePool to handle custom textures
	@constructor
	FitsTilePool constructor
 */
var FitsTilePool = function(rc)
{
	// Private properties
	var gl = rc.gl;
	var glTextures = [];
	var glBuffers = [];
	var self = this;
	
	// Public properties
	this.numCreatedTextures = 0;
	this.numReusedTextures = 0;
	
	// Private methods

	/**************************************************************************************************************/

	/**
		Create a new GL texture
	 */
	var createNewGLTexture = function(fitsData)
	{
		var glTexture = gl.createTexture();

		// TODO: flip around X axis
		// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, glTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, fitsData.width, fitsData.height, 0, gl.LUMINANCE, gl.FLOAT, fitsData.typedArray);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		self.numCreatedTextures++;
		
		return glTexture;
	}

	/**************************************************************************************************************/

	/**
		Reuse a GL texture
	 */
	var reuseGLTexture = function(fitsData)
	{
		var glTexture = glTextures.pop();
		gl.bindTexture(gl.TEXTURE_2D, glTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, fitsData.width, fitsData.height, 0, gl.LUMINANCE, gl.FLOAT, fitsData.typedArray);
		
		self.numReusedTextures++;
		
		return glTexture;
	}
		
	// Public methods
	
	/**************************************************************************************************************/

	/**
		Create a GL texture to be used by a tile
	 */
	this.createGLTexture = function(fitsData)
	{
		if ( glTextures.length > 0 )
		{
			return reuseGLTexture(fitsData);
		}
		else
		{
			return createNewGLTexture(fitsData);
		}
	};

	/**************************************************************************************************************/

	/**
		Create a GL texture to be used by a tile
	 */
	this.createGLBuffer = function(vertices)
	{
		var vb;
		if ( glBuffers.length > 0 )
		{
			vb = glBuffers.pop();
		}
		else
		{
			vb = gl.createBuffer();
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		
		return vb;
	};

	/**************************************************************************************************************/

	/**
		Dispose a texture
	 */
	this.disposeGLTexture = function(texture)
	{
		glTextures.push(texture);
	}

	/**************************************************************************************************************/

	/**
		Dispose a texture
	 */
	this.disposeGLBuffer = function(buffer)
	{
		glBuffers.push(buffer);
	}

	/**************************************************************************************************************/

	/**
		Dispose all
	 */
	this.disposeAll = function()
	{
		for ( var i = 0;  i < glTextures.length; i++ ) {
			gl.deleteTexture( glTextures[i] );
		}
		glTextures.length = 0;
		
		for ( var i = 0;  i < glBuffers.length; i++ ) {
			gl.deleteBuffer( glBuffers[i] );
		}
		glBuffers.length = 0;
	}

	/**************************************************************************************************************/	
};

return FitsTilePool;

});
