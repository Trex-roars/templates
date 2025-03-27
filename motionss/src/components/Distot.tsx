'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mesh, Raycaster, ShaderMaterial, TextureLoader, Vector2 } from 'three';

interface DistortImageProps {
    canvasImage: string | StaticImageData;
    blockSize?: number;
}

const DistortImage = ({ canvasImage, blockSize = 25 }: DistortImageProps) => {
    const meshRef = useRef<Mesh | null>(null);
    const { gl, camera, size } = useThree();
    const [mouse, setMouse] = useState(new Vector2(0, 0));
    const [hover, setHover] = useState(0);

    const raycaster = new Raycaster();

    // Load texture once on component mount
    const textureRef = useRef<THREE.Texture | null>(null);

    useEffect(() => {
        // Convert StaticImageData to string if needed
        const imageSrc = typeof canvasImage === 'string' ? canvasImage : canvasImage.src;
        textureRef.current = new TextureLoader().load(imageSrc);
    }, [canvasImage]);

    // Update mouse position on mouse move
    const handleMouseMove = (e: MouseEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        setMouse(new Vector2(x, y));
    };

    // Detect hover intensity based on mouse proximity
    const handleMouseEnter = () => setHover(2);
    const handleMouseLeave = () => setHover(0);

    // Attach mouse event listeners
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMouseMove(e);
        const canvasElement = gl.domElement;
        canvasElement.addEventListener('mousemove', onMouseMove);
        canvasElement.addEventListener('mouseenter', handleMouseEnter);
        canvasElement.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            canvasElement.removeEventListener('mousemove', onMouseMove);
            canvasElement.removeEventListener('mouseenter', handleMouseEnter);
            canvasElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [gl]);

    // Create the shader material
    const shaderMaterial = new ShaderMaterial({
        uniforms: {
            uTexture: { value: textureRef.current },
            uHover: { value: hover },
            uMouse: { value: mouse },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform vec2 uMouse;
      varying vec2 vUv;

      void main() {
        float blocks = ${blockSize.toFixed(1)};
        vec2 blocksUv = floor(vUv * blocks) / blocks;
        float distance = length(blocksUv - uMouse);
        float effect = smoothstep(0.3, 0.00, distance);

        vec2 distortion = vec2(0.0);

        if (uHover > 0.0) {
          distortion = vec2(0.03) * effect * 2.0;
        }

        vec4 textureColor = texture(uTexture, vUv);
        vec4 color = texture2D(uTexture, vUv + distortion * uHover);

        gl_FragColor = color;
      }
    `,
    });

    // Use the Raycaster to detect mouse position over the image
    useFrame(() => {
        if (shaderMaterial && meshRef.current) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(meshRef.current);
            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                shaderMaterial.uniforms.uMouse.value = uv;
            }
        }
    });

    // Calculate the correct plane size in world space based on the camera's view and canvas size
    const calculatePlaneSize = () => {
        const aspect = size.width / size.height;
        const height = camera instanceof THREE.PerspectiveCamera
            ? 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
            : 2 * camera.top; // Fallback for OrthographicCamera
        const width = height * aspect;
        return { width, height };
    };

    const { width, height } = calculatePlaneSize();

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[width, height]} />
            <primitive object={shaderMaterial} />
        </mesh>
    );
};

const DistortImageCanvas = ({ canvasImage }: DistortImageProps) => {
    return (
        <Canvas
            style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
            }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <perspectiveCamera position={[0, 0, 10]} />
            <DistortImage canvasImage={canvasImage} />
        </Canvas>
    );
};

export default DistortImageCanvas;
