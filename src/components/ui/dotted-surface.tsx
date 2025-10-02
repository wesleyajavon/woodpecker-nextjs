'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ClientOnly } from '@/components/ClientOnly';
import { WebGLDebug } from '@/components/WebGLDebug';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

function DottedSurfaceInner({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();
	const [webglSupported, setWebglSupported] = React.useState(true);

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	// Check WebGL support
	React.useEffect(() => {
		if (typeof window === 'undefined') return;
		
		try {
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) {
				setWebglSupported(false);
				return;
			}
			
			// Check for performance issues
			const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
			if (isLowEndDevice) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}
	}, []);

	useEffect(() => {
		if (!containerRef.current || typeof window === 'undefined' || !webglSupported) return;

		// Clean up any existing scene first
		if (sceneRef.current) {
			cancelAnimationFrame(sceneRef.current.animationId);
			sceneRef.current.renderer.dispose();
			if (containerRef.current && sceneRef.current.renderer.domElement) {
				try {
					containerRef.current.removeChild(sceneRef.current.renderer.domElement);
				} catch (e) {
					// Element might already be removed
				}
			}
			sceneRef.current = null;
		}

		const SEPARATION = 200;
		const AMOUNTX = 25;
		const AMOUNTY = 35;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: false, // Disable antialiasing for better performance
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const particles: THREE.Points[] = [];
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				// Use theme-based colors
				if (theme === 'light') {
					colors.push(0, 0, 0);
				} else {
					colors.push(200, 200, 200);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 8,
			vertexColors: true,
			transparent: true,
			opacity: 0.3,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number = 0;

		// Animation function
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					try {
						containerRef.current.removeChild(
							sceneRef.current.renderer.domElement,
						);
					} catch (e) {
						// Element might already be removed
					}
				}
				
				sceneRef.current = null;
			}
		};
	}, [theme, webglSupported]);

	// Fallback for browsers without WebGL support
	if (!webglSupported) {
		return (
			<div
				className={cn('pointer-events-none absolute inset-0 z-0', className)}
				style={{
					background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
					backgroundSize: '20px 20px',
					backgroundPosition: '0 0, 10px 10px',
					opacity: 0.3
				}}
				{...props}
			/>
		);
	}

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-0', className)}
			{...props}
		/>
	);
}

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	return (
		// <WebGLDebug>
			<ClientOnly
				fallback={
					<div
						className={cn('pointer-events-none absolute inset-0 z-0', className)}
						{...props}
					/>
				}
			>
				<DottedSurfaceInner className={className} {...props} />
			</ClientOnly>
		// </WebGLDebug>
	);
}
