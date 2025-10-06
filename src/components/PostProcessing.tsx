import { useEffect, useRef } from "react";

interface PostProcessingProps {
    className?: string;
    style?: React.CSSProperties;
    enablePainterly?: boolean;
    painterlyRadius?: number;
    kuwaharaAlpha?: number;
    kuwaharaSamples?: number;
    clearStrength?: number;
}

export function PostProcessingPlanetShader({
    className = "",
    style,
    enablePainterly = true,
    painterlyRadius = 7,
    kuwaharaAlpha = 25.0,
    kuwaharaSamples = 8,
    clearStrength = 1.0,
}: PostProcessingProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl =
            canvas.getContext("webgl", {
                alpha: true,
                premultipliedAlpha: false,
            }) ||
            canvas.getContext("experimental-webgl", {
                alpha: true,
                premultipliedAlpha: false,
            });
        if (!gl) {
            console.warn("WebGL not supported");
            return;
        }

        // Enable extensions
        const ext = gl.getExtension("OES_standard_derivatives");
        if (ext) {
            console.log("WebGL derivatives extension enabled");
        }

        // Disable depth testing for transparency
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        // Vertex shader for full-screen quad
        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 vUv;
            
            void main() {
                vUv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Planet fragment shader - YOUR ORIGINAL SHADER
        const planetFragmentShaderSource = `
            #ifdef GL_OES_standard_derivatives
            #extension GL_OES_standard_derivatives : enable
            #endif
            
            precision mediump float;
            varying vec2 vUv;
            uniform vec2 iResolution;
            uniform float iTime;
            uniform vec2 iMouse;
            
            // Custom fwidth implementation with different name
            #ifdef GL_OES_standard_derivatives
            float customFwidth(float x) {
                return abs(dFdx(x)) + abs(dFdy(x));
            }
            #else
            float customFwidth(float x) {
                return 0.01; // Fixed fallback value
            }
            #endif

            const float SEED = 0.0;
            vec3 CAMERA = vec3(0, 0, -1);
            const float PLANET_RADIUS = 0.8;
            const vec3 ROTATION_AXIS = vec3(0.3, 1, 0);
            const float ROTATION_SPEED = 0.2;
            const float MOON1_RADIUS = 0.2;
            const vec3 MOON1_POS = vec3(14, 4, -4);
            const float MOON2_RADIUS = 0.2;
            const vec3 MOON2_POS = vec3(12.6, 2.3, -3);
            const float MOON3_RADIUS = 0.2;
            const vec3 MOON3_POS = vec3(12.5, 1.3, -2);
            const vec3 LAND_COLOR = vec3(0.2, 0.4, 0.0);
            const vec3 JUNGLE_COLOR = vec3(0.2, 0.4, 0.0);
            const vec3 DESERT_COLOR = vec3(0.2, 0.4, 0.0);
            const vec3 SNOW_COLOR = vec3(0.2, 0.4, 0.0);
            const float OCEAN_SIZE = 0.57;
            const vec3 OCEAN_COLOR = vec3(0.1, 0.15, 0.35);
            const vec3 ATMOSPHERE_COLOR = vec3(0.4, 0.6, 1);
            const float ATMOSPHERE_DENSITY = 0.4;
            const vec3 DAWN_COLOR = vec3(1, 0.7, 0.0);
            const vec3 SUNSET_COLOR = vec3(1, 0.1, 0.0);
            const vec3 CLOUD_COLOR = vec3(0.25);
            const float AMBIENT_LIGHT = 1.0;
            const float SHADOW_STRENGTH = 0.0;
            const vec3 LIGHT1_POS = vec3(0, 0, -50);
            const vec4 LIGHT1_COLOR = vec4(1, 1, 1, 1);
            const vec3 LIGHT2_POS = vec3(8, 12, 4);
            const vec4 LIGHT2_COLOR = vec4(1, 1, 1, 1);
            const int TYPE = 0;
            const float PI = 3.14159265;
            const float TAU = 6.2831853;

            float hash12(vec2 p, float scale) {
                p = mod(p, scale);
                p.y += SEED;
                return fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float noise(vec2 p, float scale) {
                p *= scale;
                vec2 f = fract(p);
                p = floor(p);
                return mix(mix(hash12(p, scale), hash12(p + vec2(1, 0), scale), f.x),
                           mix(hash12(p + vec2(0, 1), scale), hash12(p + vec2(1, 1), scale), f.x), f.y);
            }

            float fbm(vec2 p, float scale, int octaves) {
                float s = 0.0, m = 0.0, a = 1.0;
                for(int i = 0; i < 8; i++) {
                  if(i >= octaves) break;
                  s += a * noise(p, scale);
                  m += a;
                  a *= 0.6;
                  scale *= 2.0;
                }
                return s / m;
            }

            float swirly_fbm(vec2 p, float scale, int octaves) {
                p -= iTime * 0.004;
                float s = 0.0, m = 0.0, a = 1.0;
                for(int i = 0; i < 8; i++) {
                  if(i >= octaves) break;
                  s += a * noise(p + iTime * 0.004 * a, scale);
                  m += a;
                  a *= 0.6;
                  scale *= 2.0;
                  p += vec2(cos(s * TAU), sin(s * TAU)) / scale * 0.4;
                }
                return s / m;
            }

            vec2 hash22(vec2 p, float scale) {
                p = mod(p, scale);
                p.y += SEED;
                vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
                p3 += dot(p3, p3.yzx+33.33);
                return fract((p3.xx+p3.yz)*p3.zy);
            }

            float crater_noise(vec2 p, float scale) {
                p *= scale;
                vec2 f = fract(p);
                p = floor(p);
                float va = 0.;
                float wt = 0.;
                for (int i = -1; i <= 1; i++) 
                  for (int j = -1; j <= 1; j++) {
                    vec2 g = vec2(i, j);
                    vec2 o = hash22(p + g, scale);
                    float d = distance(f - g, o);
                    float w = exp(-4. * d);
                    va += w * sin(TAU * sqrt(max(d, 0.06)));
                    wt += w;
                  }
                return abs(va / wt);
            }

            float crater_fbm(vec2 x) {
                float craters = crater_noise(x, 7.0) * 0.6 + crater_noise(x, 20.0) * 0.2;
                return 1.0 - (craters + fbm(x, 48.0, 3) * 0.35) * 0.4;
            }

            vec3 lookat(vec3 v) {
                vec3 f = normalize(CAMERA);
                vec3 s = normalize(vec3(-f.z, 0, f.x));
                vec3 u = cross(s, f);
                return v.x * s + v.y * u + v.z * (-f);
            }

            vec3 rot_axis(vec3 v, vec3 axis, float angle) {
                vec4 q = vec4(cos(angle * 0.5), axis * sin(angle * 0.5));
                return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
            }

            vec3 get_norm(vec2 uv, float z) {
                vec2 _m = vec2(iMouse) / iResolution.xy * 2.0 - 1.0;
                vec3 n = rot_axis(vec3(uv, z), normalize(ROTATION_AXIS), (_m.x * 16.0 + iTime) * ROTATION_SPEED);
                return lookat(n);
            }

            vec2 mercator(vec3 n) {
                return vec2(atan(n.z, n.x) * 0.5, acos(-n.y)) / PI;
            }

            float ray_sphere_intersect(vec3 ro, vec3 rd, vec3 so, float sr) {
                float a = dot(rd, rd);
                vec3 so_ro = ro - so;
                float b = 2.0 * dot(rd, so_ro);
                float c = dot(so_ro, so_ro) - (sr * sr);
                if (b * b - 4.0 * a * c < 0.0) {
                  return -1.0;
                }
                return (-b - sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
            }

            vec4 planet(vec2 uv) {
                float len = length(uv);
                float f = customFwidth(len);
                if (len > 1.0 - f * 0.3) 
                  return vec4(0);
                float z = -sqrt(0.999 - len * len);
                vec3 norm = get_norm(uv, z);
                vec2 muv = mercator(norm);
                if (TYPE == 1) {
                  muv.y += fbm(muv, 16.0, 4) * 0.125;
                  muv.y *= 5.0;
                }
                float smooth_edge = smoothstep(1.0, 1.0 - f * 2.0, len);
                f *= 2.0;

                vec3 col = vec3(0);
                if (TYPE == 0 || TYPE == 1) {
                  float continent = 0.0;
                  float temp = 0.0;
                  float humid = 0.0;
                  if (TYPE == 0) {
                    continent = fbm(muv, 4.0, 7);
                  } else {
                    continent = fbm(vec2(muv.y, 0), 2.0, 7);
                  }
                  temp = fbm(muv * 3.0 + vec2(31.33), 1.0, 4);
                  humid = fbm(muv * 3.0 - vec2(54.1), 1.0, 4);

                  float sqrt_continent = sqrt(continent);
                  float land = smoothstep(f, 0.0, OCEAN_SIZE - continent);
                  col += LAND_COLOR;

                  float desert = smoothstep(0.25, 0.1, humid);
                  col = mix(col, DESERT_COLOR, desert);

                  float jungle = smoothstep(0.1, 0.3, humid) * smoothstep(0.3, 0.4, temp);
                  col = mix(col, JUNGLE_COLOR, jungle);

                  float snow = smoothstep(0.3, 0.2, temp);
                  col = mix(col, SNOW_COLOR, snow);
                  col *= sqrt_continent * land * 1.2 * smoothstep(1.0, 0.99, abs(norm.y));

                  float ocean = smoothstep(OCEAN_SIZE, OCEAN_SIZE - f, continent);
                  col += (1.0 - continent) * ocean * OCEAN_COLOR;
                  col.rgb *= sqrt(1.0 + 0.1 * cos(sqrt(continent) * 512.0));
                } else if (TYPE == 2) {
                  float surface = 0.5 + pow(fbm(muv, 40.0, 4), 2.0) * smoothstep(1.0, 0.99, abs(norm.y));
                  col = (surface + pow(len, 8.0)) * 1.5 * LAND_COLOR;
                } else if (TYPE == 3) {
                  float d = crater_fbm(muv);
                  vec3 normal = normalize(vec3(
                    d - vec2(crater_fbm(muv - vec2(0.007, 0)),
                             crater_fbm(muv - vec2(0, 0.007))), -0.1));
                  float light = max(0.0, dot(normalize(LIGHT1_POS), normal));
                  light += max(0.0, dot(normalize(LIGHT2_POS), normal));
                  col = d * LAND_COLOR * (1.0 + light * smoothstep(1.0, 0.99, abs(norm.y)));
                }
                return vec4(col, smooth_edge);
            }

            vec4 clouds(vec2 uv) {
                float len = length(uv);
                float f = customFwidth(len);
                if (len > 1.0 - f * 0.3) 
                  return vec4(0);
                float z = -sqrt(0.999 - len * len);
                vec3 norm = get_norm(uv, z);
                uv = mercator(norm);
                float clouds = swirly_fbm(-uv, 11.0, 6) * smoothstep(1.0, 0.99, abs(norm.y));
                clouds = exp(-pow(clouds, 6.) * 32.0);
                return vec4(CLOUD_COLOR, clouds);
            }

            vec4 atmosphere(vec2 uv) {
                float len = length(uv);
                float altitude = max(0.0, len - PLANET_RADIUS);
                float sunset_amount = 0.0;
                float l2 = len * len;
                if (TYPE == 2) {
                  l2 = 1.;
                } else {
                  float z = -sqrt(0.999 - len * len);
                  vec3 norm = lookat(vec3(uv, z));
                  sunset_amount = smoothstep(0.5, -0.3, dot(norm, normalize(LIGHT1_POS)));
                  sunset_amount = min(sunset_amount, smoothstep(0.5, -0.3, dot(norm, normalize(LIGHT2_POS))));
                }
                float density = exp(-altitude * 7.0 * (1.0 + sunset_amount));
                density *= l2 * ATMOSPHERE_DENSITY;
                vec3 col = vec3(0);
                if (TYPE != 2) {
                  vec3 sunset = mix(DAWN_COLOR, SUNSET_COLOR, exp(-altitude * 32.0) * sunset_amount);
                  col = mix(ATMOSPHERE_COLOR, sunset, exp(-altitude * 16.0) * smoothstep(PLANET_RADIUS - 0.01, PLANET_RADIUS, len) * sunset_amount * 1.5);
                } else {
                  density *= noise(normalize(uv) + iTime * 0.05, 24.0) * 0.15 + 0.85;
                  col = LAND_COLOR * (pow(density, 5.0) * 0.5 + density * density * density + density) * 0.25;
                }
                return vec4(col, density);
            }

            void mainImage(out vec4 fragColor, in vec2 fragCoord) {
                float min_res = min(iResolution.x, iResolution.y);
                vec2 uv = (fragCoord * 2.0 - iResolution.xy) / min_res;
                float len = length(uv);
                if (len > 1.3) {
                  fragColor = vec4(0.0, 0.0, 0.0, 0.0);
                  return;
                }
                vec4 planetColor = planet(uv / PLANET_RADIUS);
                
                if (TYPE != 2) {
                  float z = -sqrt(0.999 - len * len);
                  vec3 norm = lookat(vec3(uv, z));
                  vec3 light = vec3(0);
                  float shadow = 1.0;
                  
                  float dist = 0.0;
                  vec3 n = normalize(norm - LIGHT1_POS);
                  n = normalize(norm - LIGHT2_POS);
                  
                  light += max(0.0, dot(norm, normalize(LIGHT1_POS)) * 0.8 + 0.2) * LIGHT1_COLOR.rgb * LIGHT1_COLOR.a;
                  light += max(0.0, dot(norm, normalize(LIGHT2_POS)) * 0.8 + 0.2) * LIGHT2_COLOR.rgb * LIGHT2_COLOR.a;
                
                  vec4 clouds_col = vec4(0);
                  vec4 atmosphere_col = vec4(0);
                  if (TYPE == 0) {
                    clouds_col = clouds(uv / PLANET_RADIUS);
                    clouds_col.rgb *= shadow * light + AMBIENT_LIGHT;
                    atmosphere_col = atmosphere(uv);
                    atmosphere_col.a *= smoothstep(1.2, 1.0, len);
                  } else if (TYPE == 1) {
                    atmosphere_col = atmosphere(uv);
                    atmosphere_col.a *= smoothstep(1.2, 1.0, len);
                  }
                  planetColor.rgb *= shadow * light + AMBIENT_LIGHT;
                  atmosphere_col.rgb *= light;
                  fragColor = mix(planetColor, clouds_col, clouds_col.a);
                  fragColor = mix(fragColor, atmosphere_col, atmosphere_col.a);
                } else {
                  vec4 atmosphere_col = atmosphere(uv);
                  fragColor = mix(atmosphere_col, planetColor, planetColor.a);
                }
                fragColor = clamp(fragColor, 0.0, 1.0);
                fragColor.rgb *= fragColor.a;
            }

            void main() {
                mainImage(gl_FragColor, vUv * iResolution.xy);
            }
        `;

        // Tensor analysis shader
        const tensorFragmentShaderSource = `
            precision mediump float;
            uniform sampler2D inputBuffer;
            uniform vec4 resolution;
            varying vec2 vUv;

            vec3 sobel(vec2 uv) {
                vec2 texelSize = 1.0 / resolution.xy;
                
                vec3 tl = texture2D(inputBuffer, uv + vec2(-texelSize.x, -texelSize.y)).rgb;
                vec3 tm = texture2D(inputBuffer, uv + vec2(0.0, -texelSize.y)).rgb;
                vec3 tr = texture2D(inputBuffer, uv + vec2(texelSize.x, -texelSize.y)).rgb;
                
                vec3 ml = texture2D(inputBuffer, uv + vec2(-texelSize.x, 0.0)).rgb;
                vec3 mr = texture2D(inputBuffer, uv + vec2(texelSize.x, 0.0)).rgb;
                
                vec3 bl = texture2D(inputBuffer, uv + vec2(-texelSize.x, texelSize.y)).rgb;
                vec3 bm = texture2D(inputBuffer, uv + vec2(0.0, texelSize.y)).rgb;
                vec3 br = texture2D(inputBuffer, uv + vec2(texelSize.x, texelSize.y)).rgb;
                
                vec3 sobelX = tl * -1.0 + tr * 1.0 +
                              ml * -2.0 + mr * 2.0 +
                              bl * -1.0 + br * 1.0;
                
                vec3 sobelY = tl * -1.0 + tm * -2.0 + tr * -1.0 +
                              bl * 1.0 + bm * 2.0 + br * 1.0;
                
                return vec3(sobelX.r, sobelY.r, sobelX.g);
            }

            void main() {
                vec3 gradient = sobel(vUv);
                vec3 color = texture2D(inputBuffer, vUv).rgb;
                float luminance = dot(color, vec3(0.299, 0.587, 0.114));
                
                float Jxx = gradient.x * gradient.x;
                float Jyy = gradient.y * gradient.y;  
                float Jxy = gradient.x * gradient.y;
                
                gl_FragColor = vec4(Jxx, Jyy, Jxy, luminance);
            }
        `;

        // Kuwahara filter shader
        const kuwaharaFragmentShaderSource = `
            #define SECTOR_COUNT 8
            precision mediump float;
            
            uniform int radius;
            uniform sampler2D inputBuffer;
            uniform vec4 resolution;
            uniform sampler2D originalTexture;
            uniform float alpha;
            varying vec2 vUv;

            vec4 fromLinear(vec4 linearRGB) {
                bvec3 cutoff = lessThan(linearRGB.rgb, vec3(0.0031308));
                vec3 higher = vec3(1.055)*pow(linearRGB.rgb, vec3(1.0/2.4)) - vec3(0.055);
                vec3 lower = linearRGB.rgb * vec3(12.92);
                vec3 result = vec3(
                    cutoff.r ? lower.r : higher.r,
                    cutoff.g ? lower.g : higher.g,
                    cutoff.b ? lower.b : higher.b
                );
                return vec4(result, linearRGB.a);
            }

            vec3 sampleColor(vec2 offset) {
                vec2 coord = (gl_FragCoord.xy + offset) / resolution.xy;
                return texture2D(originalTexture, coord).rgb;
            }

            vec4 getDominantOrientation(vec4 structureTensor) {
                float Jxx = structureTensor.r; 
                float Jyy = structureTensor.g; 
                float Jxy = structureTensor.b; 

                float trace = Jxx + Jyy;
                float determinant = Jxx * Jyy - Jxy * Jxy;

                float lambda1 = trace * 0.5 + sqrt(trace * trace * 0.25 - determinant);
                float lambda2 = trace * 0.5 - sqrt(trace * trace * 0.25 - determinant);
                
                float jxyStrength = abs(Jxy) / (abs(Jxx) + abs(Jyy) + abs(Jxy) + 1e-6);

                vec2 v;
                if (jxyStrength > 0.0) {
                    v = normalize(vec2(-Jxy, Jxx - lambda1));
                } else {
                    v = vec2(0.0, 1.0);
                }

                return vec4(normalize(v), lambda1, lambda2);
            }

            float polynomialWeight(float x, float y, float eta, float lambda) {
                float polyValue = (x + eta) - lambda * (y * y);
                return max(0.0, polyValue * polyValue);
            }

            void getSectorVarianceAndAverageColor(mat2 anisotropyMat, float angle, float radiusFloat, out vec3 avgColor, out float variance) {
                vec3 weightedColorSum = vec3(0.0);
                vec3 weightedSquaredColorSum = vec3(0.0);
                float totalWeight = 0.0;

                float eta = 0.1;
                float lambda = 0.5;

                for (float r = 1.0; r <= 10.0; r += 1.0) {
                    if (r > radiusFloat) break;
                    for (float a = -0.392699; a <= 0.392699; a += 0.196349) {
                        vec2 sampleOffset = r * vec2(cos(angle + a), sin(angle + a));
                        sampleOffset = anisotropyMat * sampleOffset;

                        vec3 color = sampleColor(sampleOffset);
                        float weight = polynomialWeight(sampleOffset.x, sampleOffset.y, eta, lambda);

                        weightedColorSum += color * weight;
                        weightedSquaredColorSum += color * color * weight;
                        totalWeight += weight;
                    }
                }

                if (totalWeight > 0.0) {
                    avgColor = weightedColorSum / totalWeight;
                    vec3 varianceRes = (weightedSquaredColorSum / totalWeight) - (avgColor * avgColor);
                    variance = dot(varianceRes, vec3(0.299, 0.587, 0.114));
                } else {
                    avgColor = vec3(0.0);
                    variance = 0.0;
                }
            }

            void main() {
                vec4 structureTensor = texture2D(inputBuffer, vUv);

                vec3 sectorAvgColors[8];
                float sectorVariances[8];

                vec4 orientationAndAnisotropy = getDominantOrientation(structureTensor);
                vec2 orientation = orientationAndAnisotropy.xy;

                float anisotropy = (orientationAndAnisotropy.z - orientationAndAnisotropy.w) / (orientationAndAnisotropy.z + orientationAndAnisotropy.w + 1e-6);

                float alphaValue = 25.0; // Use the original hardcoded value for now
                float scaleX = alphaValue / (anisotropy + alphaValue);
                float scaleY = (anisotropy + alphaValue) / alphaValue;

                mat2 anisotropyMat = mat2(orientation.x, -orientation.y, orientation.y, orientation.x) * mat2(scaleX, 0.0, 0.0, scaleY);

                for (int i = 0; i < 8; i++) {
                  float angle = float(i) * 6.28318 / 8.0;
                  getSectorVarianceAndAverageColor(anisotropyMat, angle, float(radius), sectorAvgColors[i], sectorVariances[i]);
                }

                float minVariance = sectorVariances[0];
                vec3 finalColor = sectorAvgColors[0];

                for (int i = 1; i < 8; i++) {
                    if (sectorVariances[i] < minVariance) {
                        minVariance = sectorVariances[i];
                        finalColor = sectorAvgColors[i];
                    }
                }

                vec4 color = vec4(finalColor, 1.0);
                gl_FragColor = fromLinear(color);
            }
        `;

        // Final composition shader
        const finalFragmentShaderSource = `
            precision mediump float;
            uniform sampler2D inputBuffer;
            uniform sampler2D watercolorTexture;
            varying vec2 vUv;

            vec3 ACESFilm(vec3 x) {
                float a = 2.51;
                float b = 0.03;
                float c = 2.43;
                float d = 0.59;
                float e = 0.14;
                return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
            }

            vec3 sat(vec3 rgb, float adjustment) {
                vec3 W = vec3(0.2125, 0.7154, 0.0721);
                vec3 intensity = vec3(dot(rgb, W));
                return mix(intensity, rgb, adjustment);
            }

            void main() {
                vec4 inputColor = texture2D(inputBuffer, vUv);
                vec3 color = inputColor.rgb;
                vec4 watercolorColor = texture2D(watercolorTexture, vUv);
                
                // Check if there's actually content (not just black/empty)
                float contentMask = step(0.001, length(color));
                
                vec3 grayscale = vec3(dot(color, vec3(0.299, 0.587, 0.114)));

                int n = 16;
                float x = grayscale.r;
                float qn = floor(x * float(n - 1) + 0.5) / float(n - 1);
                qn = clamp(qn, 0.2, 0.7);

                if (qn < 0.5) {
                    color = mix(vec3(0.1), color.rgb, qn * 2.0);
                } else {
                    color = mix(color.rgb, vec3(1.0), (qn - 0.5) * 2.0);
                }

                color = sat(color, 1.5);
                color = ACESFilm(color);
                vec4 outputColor = vec4(color, contentMask);
                outputColor *= watercolorColor;

                gl_FragColor = outputColor;
            }
        `;

        // Compile shader helper
        function compileShader(
            type: number,
            source: string
        ): WebGLShader | null {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    "Shader compilation error:",
                    gl.getShaderInfoLog(shader)
                );
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }

        // Create program helper
        function createProgram(
            vertexShader: WebGLShader,
            fragmentShader: WebGLShader
        ): WebGLProgram | null {
            const program = gl.createProgram();
            if (!program) return null;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(
                    "Program linking error:",
                    gl.getProgramInfoLog(program)
                );
                gl.deleteProgram(program);
                return null;
            }

            return program;
        }

        // Create framebuffer helper
        function createFramebuffer(
            width: number,
            height: number
        ): { fb: WebGLFramebuffer; texture: WebGLTexture } | null {
            const framebuffer = gl.createFramebuffer();
            const texture = gl.createTexture();

            if (!framebuffer || !texture) return null;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Create an empty transparent buffer first
            const emptyData = new Uint8Array(width * height * 4);
            for (let i = 0; i < emptyData.length; i += 4) {
                emptyData[i] = 0; // R
                emptyData[i + 1] = 0; // G
                emptyData[i + 2] = 0; // B
                emptyData[i + 3] = 0; // A (transparent)
            }
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                width,
                height,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                emptyData
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
            );

            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D,
                texture,
                0
            );

            if (
                gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
                gl.FRAMEBUFFER_COMPLETE
            ) {
                console.error("Framebuffer not complete");
                return null;
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            return { fb: framebuffer, texture };
        }

        // Create paper texture
        function createPaperTexture(): WebGLTexture | null {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            ctx.fillStyle = "#f8f8f8";
            ctx.fillRect(0, 0, 512, 512);

            for (let i = 0; i < 1000; i++) {
                ctx.fillStyle = `rgba(200, 200, 200, ${Math.random() * 0.3})`;
                ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
            }

            const texture = gl.createTexture();
            if (!texture) return null;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                canvas
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                gl.CLAMP_TO_EDGE
            );
            gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                gl.CLAMP_TO_EDGE
            );
            gl.bindTexture(gl.TEXTURE_2D, null);

            return texture;
        }

        // Compile all shaders
        const vertexShader = compileShader(
            gl.VERTEX_SHADER,
            vertexShaderSource
        );
        const planetFragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            planetFragmentShaderSource
        );
        const tensorFragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            tensorFragmentShaderSource
        );
        const kuwaharaFragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            kuwaharaFragmentShaderSource
        );
        const finalFragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            finalFragmentShaderSource
        );

        if (
            !vertexShader ||
            !planetFragmentShader ||
            !tensorFragmentShader ||
            !kuwaharaFragmentShader ||
            !finalFragmentShader
        ) {
            console.error("Failed to compile shaders");
            return;
        }

        // Create programs
        const planetProgram = createProgram(vertexShader, planetFragmentShader);
        const tensorProgram = createProgram(vertexShader, tensorFragmentShader);
        const kuwaharaProgram = createProgram(
            vertexShader,
            kuwaharaFragmentShader
        );
        const finalProgram = createProgram(vertexShader, finalFragmentShader);

        if (
            !planetProgram ||
            !tensorProgram ||
            !kuwaharaProgram ||
            !finalProgram
        ) {
            console.error("Failed to create programs");
            return;
        }

        // Get uniform locations
        const planetUniforms = {
            resolution: gl.getUniformLocation(planetProgram, "iResolution"),
            time: gl.getUniformLocation(planetProgram, "iTime"),
            mouse: gl.getUniformLocation(planetProgram, "iMouse"),
            position: gl.getAttribLocation(planetProgram, "a_position"),
        };

        const tensorUniforms = {
            inputBuffer: gl.getUniformLocation(tensorProgram, "inputBuffer"),
            resolution: gl.getUniformLocation(tensorProgram, "resolution"),
            position: gl.getAttribLocation(tensorProgram, "a_position"),
        };

        const kuwaharaUniforms = {
            inputBuffer: gl.getUniformLocation(kuwaharaProgram, "inputBuffer"),
            originalTexture: gl.getUniformLocation(
                kuwaharaProgram,
                "originalTexture"
            ),
            resolution: gl.getUniformLocation(kuwaharaProgram, "resolution"),
            radius: gl.getUniformLocation(kuwaharaProgram, "radius"),
            alpha: gl.getUniformLocation(kuwaharaProgram, "alpha"),
            position: gl.getAttribLocation(kuwaharaProgram, "a_position"),
        };

        const finalUniforms = {
            inputBuffer: gl.getUniformLocation(finalProgram, "inputBuffer"),
            watercolorTexture: gl.getUniformLocation(
                finalProgram,
                "watercolorTexture"
            ),
            position: gl.getAttribLocation(finalProgram, "a_position"),
        };

        // Create vertex buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        // Create framebuffers and textures
        let planetFB: { fb: WebGLFramebuffer; texture: WebGLTexture } | null =
            null;
        let tensorFB: { fb: WebGLFramebuffer; texture: WebGLTexture } | null =
            null;
        let kuwaharaFB: { fb: WebGLFramebuffer; texture: WebGLTexture } | null =
            null;

        // Create paper texture
        const paperTexture = createPaperTexture();

        function resizeCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const displayWidth = rect.width;
            const displayHeight = rect.height;
            const devicePixelRatio = window.devicePixelRatio || 1;

            canvas.width = displayWidth * devicePixelRatio;
            canvas.height = displayHeight * devicePixelRatio;

            gl.viewport(0, 0, canvas.width, canvas.height);

            // Recreate framebuffers with new size
            if (enablePainterly) {
                planetFB = createFramebuffer(canvas.width, canvas.height);
                tensorFB = createFramebuffer(canvas.width, canvas.height);
                kuwaharaFB = createFramebuffer(canvas.width, canvas.height);
            }
        }

        function render() {
            if (!canvasRef.current) return;

            resizeCanvas();
            const currentTime = (Date.now() - startTimeRef.current) / 1000.0;

            if (
                enablePainterly &&
                planetFB &&
                tensorFB &&
                kuwaharaFB &&
                paperTexture
            ) {
                // Multi-pass rendering

                // Pass 1: Render planet to texture
                gl.bindFramebuffer(gl.FRAMEBUFFER, planetFB.fb);
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

                gl.useProgram(planetProgram);
                gl.uniform2f(
                    planetUniforms.resolution,
                    canvas.width,
                    canvas.height
                );
                gl.uniform1f(planetUniforms.time, currentTime);
                gl.uniform2f(planetUniforms.mouse, 0.0, 0.0);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(planetUniforms.position);
                gl.vertexAttribPointer(
                    planetUniforms.position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                // Pass 2: Tensor field analysis
                gl.bindFramebuffer(gl.FRAMEBUFFER, tensorFB.fb);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.disable(gl.BLEND);
                gl.useProgram(tensorProgram);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, planetFB.texture);
                gl.uniform1i(tensorUniforms.inputBuffer, 0);
                gl.uniform4f(
                    tensorUniforms.resolution,
                    canvas.width,
                    canvas.height,
                    1.0 / canvas.width,
                    1.0 / canvas.height
                );

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(tensorUniforms.position);
                gl.vertexAttribPointer(
                    tensorUniforms.position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                // Pass 3: Kuwahara filter
                gl.bindFramebuffer(gl.FRAMEBUFFER, kuwaharaFB.fb);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.disable(gl.BLEND);
                gl.useProgram(kuwaharaProgram);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, tensorFB.texture);
                gl.uniform1i(kuwaharaUniforms.inputBuffer, 0);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, planetFB.texture);
                gl.uniform1i(kuwaharaUniforms.originalTexture, 1);

                gl.uniform4f(
                    kuwaharaUniforms.resolution,
                    canvas.width,
                    canvas.height,
                    1.0 / canvas.width,
                    1.0 / canvas.height
                );
                gl.uniform1i(kuwaharaUniforms.radius, painterlyRadius);
                gl.uniform1f(kuwaharaUniforms.alpha, kuwaharaAlpha);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(kuwaharaUniforms.position);
                gl.vertexAttribPointer(
                    kuwaharaUniforms.position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                // Pass 4: Final composition to screen
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.useProgram(finalProgram);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, kuwaharaFB.texture);
                gl.uniform1i(finalUniforms.inputBuffer, 0);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, paperTexture);
                gl.uniform1i(finalUniforms.watercolorTexture, 1);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(finalUniforms.position);
                gl.vertexAttribPointer(
                    finalUniforms.position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            } else {
                // Direct planet rendering
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.useProgram(planetProgram);
                gl.uniform2f(
                    planetUniforms.resolution,
                    canvas.width,
                    canvas.height
                );
                gl.uniform1f(planetUniforms.time, currentTime);
                gl.uniform2f(planetUniforms.mouse, 0.0, 0.0);

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.enableVertexAttribArray(planetUniforms.position);
                gl.vertexAttribPointer(
                    planetUniforms.position,
                    2,
                    gl.FLOAT,
                    false,
                    0,
                    0
                );
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }

            animationRef.current = requestAnimationFrame(render);
        }

        resizeCanvas();
        render();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Cleanup
            gl.deleteProgram(planetProgram);
            gl.deleteProgram(tensorProgram);
            gl.deleteProgram(kuwaharaProgram);
            gl.deleteProgram(finalProgram);
            gl.deleteShader(vertexShader);
            gl.deleteShader(planetFragmentShader);
            gl.deleteShader(tensorFragmentShader);
            gl.deleteShader(kuwaharaFragmentShader);
            gl.deleteShader(finalFragmentShader);

            if (planetFB) {
                gl.deleteFramebuffer(planetFB.fb);
                gl.deleteTexture(planetFB.texture);
            }
            if (tensorFB) {
                gl.deleteFramebuffer(tensorFB.fb);
                gl.deleteTexture(tensorFB.texture);
            }
            if (kuwaharaFB) {
                gl.deleteFramebuffer(kuwaharaFB.fb);
                gl.deleteTexture(kuwaharaFB.texture);
            }
            if (paperTexture) {
                gl.deleteTexture(paperTexture);
            }
        };
    }, [
        enablePainterly,
        painterlyRadius,
        kuwaharaAlpha,
        kuwaharaSamples,
        clearStrength,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={`${className}`}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                backgroundColor: "transparent",
                ...style,
            }}
        />
    );
}
