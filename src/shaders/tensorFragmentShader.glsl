uniform sampler2D inputBuffer;
uniform vec4 resolution;
varying vec2 vUv;

vec3 sobel(vec2 uv) {
    vec2 texelSize = 1.0 / resolution.xy;
    
    // Sample neighboring pixels
    vec3 tl = texture2D(inputBuffer, uv + vec2(-texelSize.x, -texelSize.y)).rgb;
    vec3 tm = texture2D(inputBuffer, uv + vec2(0.0, -texelSize.y)).rgb;
    vec3 tr = texture2D(inputBuffer, uv + vec2(texelSize.x, -texelSize.y)).rgb;
    
    vec3 ml = texture2D(inputBuffer, uv + vec2(-texelSize.x, 0.0)).rgb;
    vec3 mr = texture2D(inputBuffer, uv + vec2(texelSize.x, 0.0)).rgb;
    
    vec3 bl = texture2D(inputBuffer, uv + vec2(-texelSize.x, texelSize.y)).rgb;
    vec3 bm = texture2D(inputBuffer, uv + vec2(0.0, texelSize.y)).rgb;
    vec3 br = texture2D(inputBuffer, uv + vec2(texelSize.x, texelSize.y)).rgb;
    
    // Sobel X kernel
    vec3 sobelX = tl * -1.0 + tr * 1.0 +
                  ml * -2.0 + mr * 2.0 +
                  bl * -1.0 + br * 1.0;
    
    // Sobel Y kernel  
    vec3 sobelY = tl * -1.0 + tm * -2.0 + tr * -1.0 +
                  bl * 1.0 + bm * 2.0 + br * 1.0;
    
    return vec3(sobelX.r, sobelY.r, sobelX.g);
}

void main() {
    vec3 gradient = sobel(vUv);
    
    // Convert to grayscale for edge detection
    vec3 color = texture2D(inputBuffer, vUv).rgb;
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    
    // Calculate structure tensor
    float Jxx = gradient.x * gradient.x;
    float Jyy = gradient.y * gradient.y;  
    float Jxy = gradient.x * gradient.y;
    
    gl_FragColor = vec4(Jxx, Jyy, Jxy, luminance);
}