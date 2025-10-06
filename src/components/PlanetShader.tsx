import { useEffect, useRef } from "react";

interface PlanetShaderProps {
    className?: string;
    style?: React.CSSProperties;
}

export function PlanetShader({ className = "", style }: PlanetShaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
        if (!gl) {
            console.warn("WebGL not supported");
            return;
        }

        // Enable derivatives extension if available
        const ext = gl.getExtension("OES_standard_derivatives");
        if (ext) {
            console.log("WebGL derivatives extension enabled");
        }

        // Vertex shader - simple full-screen quad
        const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

        // Fragment shader - your planet shader code
        const fragmentShaderSource = `
      #ifdef GL_OES_standard_derivatives
      #extension GL_OES_standard_derivatives : enable
      #endif
      
      precision mediump float;
      varying vec2 v_uv;
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
      const float PLANET_RADIUS = 0.9;
      const vec3 ROTATION_AXIS = vec3(0.3, 1, 0);
      const float ROTATION_SPEED = 0.2;
      const float MOON1_RADIUS = 0.2;
      const vec3 MOON1_POS = vec3(14, 4, -4);
      const float MOON2_RADIUS = 0.2;
      const vec3 MOON2_POS = vec3(12.6, 2.3, -3);
      const float MOON3_RADIUS = 0.2;
      const vec3 MOON3_POS = vec3(12.5, 1.3, -2);
      const vec3 LAND_COLOR = vec3(0.2, 0.4, 0.0);
      const vec3 JUNGLE_COLOR = vec3(0.0, 0.2, 0.0);
      const vec3 DESERT_COLOR = vec3(1, 0.8, 0.6);
      const vec3 SNOW_COLOR = vec3(0.85, 0.85, 0.5);
      const float OCEAN_SIZE = 0.57;
      const vec3 OCEAN_COLOR = vec3(0.1, 0.15, 0.35);
      const vec3 ATMOSPHERE_COLOR = vec3(0.4, 0.6, 1);
      const float ATMOSPHERE_DENSITY = 0.6;
      const vec3 DAWN_COLOR = vec3(1, 0.7, 0.0);
      const vec3 SUNSET_COLOR = vec3(1, 0.1, 0.0);
      const vec3 CLOUD_COLOR = vec3(0.8);
      const float AMBIENT_LIGHT = 0.2;
      const float SHADOW_STRENGTH = 0.0;
      const vec3 LIGHT1_POS = vec3(0, 0, -50);
      const vec4 LIGHT1_COLOR = vec4(1, 1, 1, 0.9);
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
          #define S(lp, mp, mr, n) dist = ray_sphere_intersect(lp, n, mp, mr); if (dist >= 0.0) shadow *= 1.0 - SHADOW_STRENGTH * smoothstep(0.0, 0.5, -(dist - distance(mp, lp)) / mr)
          vec3 n = normalize(norm - LIGHT1_POS);
          S(LIGHT1_POS, MOON1_POS, MOON1_RADIUS, n);
          S(LIGHT1_POS, MOON2_POS, MOON2_RADIUS, n);
          S(LIGHT1_POS, MOON3_POS, MOON3_RADIUS, n);
          
          n = normalize(norm - LIGHT2_POS);
          S(LIGHT2_POS, MOON1_POS, MOON1_RADIUS, n);
          S(LIGHT2_POS, MOON2_POS, MOON2_RADIUS, n);
          S(LIGHT2_POS, MOON3_POS, MOON3_RADIUS, n);
          
          light += max(0.0, dot(norm, normalize(LIGHT1_POS)) * 0.8 + 0.2) * LIGHT1_COLOR.rgb * LIGHT1_COLOR.a;
          light += max(0.0, dot(norm, normalize(LIGHT2_POS)) * 0.8 + 0.2) * LIGHT2_COLOR.rgb * LIGHT2_COLOR.a;
        
          vec4 clouds_col = vec4(0);
          vec4 atmosphere_col = vec4(0);
          if (TYPE == 0) {
            clouds_col = clouds(uv / PLANET_RADIUS);
            clouds_col.rgb *= shadow * light + AMBIENT_LIGHT;
            atmosphere_col = atmosphere(uv);
            // Limit atmosphere effect to reduce vignette
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
        mainImage(gl_FragColor, v_uv * iResolution.xy);
      }
    `;

        // Create shader function
        function createShader(
            gl: WebGLRenderingContext,
            type: number,
            source: string
        ): WebGLShader | null {
            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    "Shader compile error:",
                    gl.getShaderInfoLog(shader)
                );
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }

        // Create program
        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );
        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        // Get attribute and uniform locations
        const positionAttributeLocation = gl.getAttribLocation(
            program,
            "a_position"
        );
        const resolutionUniformLocation = gl.getUniformLocation(
            program,
            "iResolution"
        );
        const timeUniformLocation = gl.getUniformLocation(program, "iTime");
        const mouseUniformLocation = gl.getUniformLocation(program, "iMouse");

        // Create a buffer for the quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        );

        // Resize canvas to match display size
        function resizeCanvas() {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const displayWidth = rect.width;
            const displayHeight = rect.height;

            // Set actual canvas size in memory (scaled by device pixel ratio for sharpness)
            const devicePixelRatio = window.devicePixelRatio || 1;
            canvas.width = displayWidth * devicePixelRatio;
            canvas.height = displayHeight * devicePixelRatio;

            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        // Animation loop
        function animate() {
            if (!canvasRef.current) return;

            resizeCanvas();

            const currentTime = (Date.now() - startTimeRef.current) / 1000;

            gl.useProgram(program);

            // Set uniforms
            gl.uniform2f(
                resolutionUniformLocation,
                canvas.width,
                canvas.height
            );
            gl.uniform1f(timeUniformLocation, currentTime);
            gl.uniform2f(mouseUniformLocation, 0, 0); // You can add mouse interaction later

            // Bind position attribute
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(
                positionAttributeLocation,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );

            // Draw
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationRef.current = requestAnimationFrame(animate);
        }

        // Start animation
        resizeCanvas();
        animate();

        // Handle resize
        const handleResize = () => resizeCanvas();
        window.addEventListener("resize", handleResize);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener("resize", handleResize);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`${className}`}
            style={{
                width: "100%",
                height: "100%",
                display: "block",
                ...style,
            }}
        />
    );
}
