"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  createCosmicSceneConfig,
  getCosmicPointerTransform,
  getCosmicScrollState,
} from "./background-graph-model";

const YoonityPalette = [
  new THREE.Color("#10d59b"),
  new THREE.Color("#42e6c1"),
  new THREE.Color("#40a9ff"),
  new THREE.Color("#786cff"),
];

export function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isNarrow = window.innerWidth < 640;
    const config = createCosmicSceneConfig(isNarrow);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.045);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = getCosmicScrollState(0).cameraZ;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isNarrow ? 1.4 : 2),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);

    const starPositions = new Float32Array(config.positions);
    const starColors = new Float32Array(config.particleCount * 3);
    for (let index = 0; index < config.particleCount; index += 1) {
      const offset = index * 3;
      const color = new THREE.Color().setHSL(
        config.colors[offset],
        config.colors[offset + 1],
        config.colors[offset + 2],
      );
      starColors.set([color.r, color.g, color.b], offset);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    starGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3),
    );
    const starMaterial = new THREE.PointsMaterial({
      size: isNarrow ? 0.026 : 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      sizeAttenuation: true,
      depthWrite: false,
      fog: true,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const sculptureScroll = new THREE.Group();
    const initialScroll = getCosmicScrollState(0);
    sculptureScroll.position.x = isNarrow ? 0 : initialScroll.sculptureX;
    scene.add(sculptureScroll);

    const sculpturePointer = new THREE.Group();
    sculptureScroll.add(sculpturePointer);

    const sculptureSpin = new THREE.Group();
    sculpturePointer.add(sculptureSpin);

    const solidGeometry = new THREE.IcosahedronGeometry(1, 1);
    const edgeGeometry = new THREE.EdgesGeometry(solidGeometry, 8);
    const edgePosition = edgeGeometry.getAttribute("position");
    const edgeColors = new Float32Array(edgePosition.count * 3);
    for (let index = 0; index < edgePosition.count; index += 1) {
      const color = YoonityPalette[index % YoonityPalette.length];
      edgeColors.set([color.r, color.g, color.b], index * 3);
    }
    edgeGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(edgeColors, 3),
    );
    const edgeMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      fog: true,
    });
    const icosahedron = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    sculptureSpin.add(icosahedron);

    const glowGeometry = new THREE.IcosahedronGeometry(0.96, 1);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x119dff,
      transparent: true,
      opacity: 0.025,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: true,
    });
    sculptureSpin.add(new THREE.Mesh(glowGeometry, glowMaterial));

    const pointerSetters = reduceMotion
      ? undefined
      : {
          rotationX: gsap.quickTo(sculpturePointer.rotation, "x", {
            duration: 0.8,
            ease: "power3.out",
          }),
          rotationY: gsap.quickTo(sculpturePointer.rotation, "y", {
            duration: 0.8,
            ease: "power3.out",
          }),
          cameraX: gsap.quickTo(camera.position, "x", {
            duration: 1,
            ease: "power3.out",
          }),
          cameraY: gsap.quickTo(camera.position, "y", {
            duration: 1,
            ease: "power3.out",
          }),
        };

    const moveScene = (x: number, y: number) => {
      if (!pointerSetters) return;
      const target = getCosmicPointerTransform(x, y);
      pointerSetters.rotationX(target.rotationX);
      pointerSetters.rotationY(target.rotationY);
      pointerSetters.cameraX(target.cameraX);
      pointerSetters.cameraY(target.cameraY);
    };
    const onPointerMove = (event: PointerEvent) => {
      moveScene(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    const onPointerLeave = () => moveScene(0, 0);
    if (!reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    let scrollTimeline: gsap.core.Timeline | undefined;
    if (!reduceMotion) {
      const end = getCosmicScrollState(1);
      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      scrollTimeline
        .to(
          sculptureScroll.scale,
          { x: end.scale, y: end.scale, z: end.scale, ease: "none" },
          0,
        )
        .to(sculptureScroll.rotation, { z: end.rotationZ, ease: "none" }, 0)
        .to(
          sculptureScroll.position,
          { x: isNarrow ? 1.8 : end.sculptureX, ease: "none" },
          0,
        )
        .to(camera.position, { z: end.cameraZ, ease: "none" }, 0);
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1.4 : 2),
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize, { passive: true });

    let frame = 0;
    let running = !document.hidden;
    const renderFrame = () => {
      sculptureSpin.rotation.x += 0.0018;
      sculptureSpin.rotation.y += 0.0038;
      starField.rotation.y += 0.00018;
      starField.rotation.x += 0.00005;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    const animate = () => {
      if (!running) return;
      renderFrame();
      frame = requestAnimationFrame(animate);
    };
    const onVisibilityChange = () => {
      running = !document.hidden;
      cancelAnimationFrame(frame);
      if (running && !reduceMotion) frame = requestAnimationFrame(animate);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (reduceMotion) renderer.render(scene, camera);
    else if (running) frame = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (pointerSetters) {
        pointerSetters.rotationX.tween.kill();
        pointerSetters.rotationY.tween.kill();
        pointerSetters.cameraX.tween.kill();
        pointerSetters.cameraY.tween.kill();
      }
      scrollTimeline?.scrollTrigger?.kill();
      scrollTimeline?.kill();
      starGeometry.dispose();
      starMaterial.dispose();
      solidGeometry.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 60% at 68% 42%, color-mix(in srgb, var(--axis-ai) 11%, transparent), color-mix(in srgb, var(--axis-quantum) 5%, transparent) 48%, transparent 78%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
