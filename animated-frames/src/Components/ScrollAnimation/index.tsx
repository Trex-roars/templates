import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animationContent, AnimationItem } from "./content";


interface ImageRef {
    current: HTMLImageElement[];
}

const ScrollAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const elementsRef = useRef<Record<string, HTMLElement | null>>({});
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [loadingProgress, setLoadingProgress] = useState<number>(0);
    const frameCount = 382;
    const images = useRef<HTMLImageElement[]>([]) as ImageRef;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);



    // Load all images with progress tracking
    useEffect(() => {
        let isMounted = true;

        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loadedCount = 0;

            for (let i = 1; i < frameCount; i++) {
                const img = document.createElement('img') as HTMLImageElement;
                img.src = `/framess/frame_${i.toString().padStart(4, '0')}.jpg`;

                img.onload = () => {
                    if (!isMounted) return;

                    loadedCount++;
                    const progress = Math.floor((loadedCount / (frameCount - 1)) * 100);
                    setLoadingProgress(progress);

                    if (loadedCount === frameCount - 1) {
                        setImagesLoaded(true);

                        // Animate in the overlay once loaded
                        if (overlayRef.current) {
                            gsap.to(overlayRef.current, {
                                opacity: 1,
                                duration: 1,
                                ease: "power2.inOut"
                            });
                        }
                    }
                };

                img.onerror = (err) => {
                    console.error(`Error loading image ${i}:`, err);
                };

                loadedImages.push(img);
            }

            images.current = loadedImages;
        };

        loadImages();

        // Clean up function
        return () => {
            isMounted = false;
            images.current = [];
        };
    }, []);

    // Set up canvas and scroll animation
    useEffect(() => {
        if (!imagesLoaded || images.current.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Add a canvas filter effect
        context.filter = 'brightness(1.05) contrast(1.1)';

        // Set canvas dimensions
        const resizeCanvas = () => {
            if (!canvas) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Force initial render
            const currentScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const frameIndex = Math.min(
                frameCount - 2,
                Math.floor(currentScroll * (frameCount - 1))
            );
            renderFrame(frameIndex);
        };

        // Draw the current frame with enhancement
        const renderFrame = (index: number) => {
            if (!context || index < 0 || index >= images.current.length) return;

            const img = images.current[index];

            // Calculate position to cover the entire canvas
            const aspectRatio = img.width / img.height;
            let drawWidth: number, drawHeight: number;

            if (canvas.width / canvas.height > aspectRatio) {
                // Canvas is wider than image
                drawWidth = canvas.width;
                drawHeight = drawWidth / aspectRatio;
            } else {
                // Canvas is taller than image
                drawHeight = canvas.height;
                drawWidth = drawHeight * aspectRatio;
            }

            const x = (canvas.width - drawWidth) / 2;
            const y = (canvas.height - drawHeight) / 2;

            // Clear canvas and draw image
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, drawWidth, drawHeight);

            // Add a subtle vignette effect
            const gradient = context.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.8
            );
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.3)');

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        };

        // Initialize canvas
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Set up scroll trigger with enhanced animation
        let scrollAnimation: ScrollTrigger;

        if (containerRef.current) {
            // Main frame animation
            scrollAnimation = ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3, // Smoother scrub
                onUpdate: (self) => {
                    const frameIndex = Math.min(
                        frameCount - 2,
                        Math.floor(self.progress * (frameCount - 1))
                    );

                    renderFrame(frameIndex);

                    // Update dynamic content based on current frame
                    animationContent.forEach(item => {
                        const element = elementsRef.current[item.id];
                        if (!element) return;

                        // Check if the element should be visible
                        const isVisible = frameIndex >= item.startFrame && frameIndex <= item.endFrame;

                        // Calculate visibility progress within the element's frame range
                        const elementProgress = Math.min(1, Math.max(0,
                            (frameIndex - item.startFrame) / (item.endFrame - item.startFrame)
                        ));

                        // Apply visibility
                        if (isVisible) {
                            // Element is within its visible range
                            gsap.set(element, { visibility: "visible" });

                            // Apply parallax effect if configured
                            if (item.parallax) {
                                const parallaxValue = (elementProgress - 0.5) * item.parallax.intensity;
                                gsap.to(element, {
                                    [item.parallax.direction]: parallaxValue,
                                    ease: "none",
                                    duration: 0
                                });
                            }

                            // Apply fade in/out within the element's range
                            if (elementProgress < 0.1) {
                                // Fading in - first 10% of its range
                                const fadeInProgress = elementProgress / 0.1;
                                gsap.to(element, {
                                    opacity: fadeInProgress,
                                    ease: "none",
                                    duration: 0
                                });
                            } else if (elementProgress > 0.9) {
                                // Fading out - last 10% of its range
                                const fadeOutProgress = (elementProgress - 0.9) / 0.1;
                                gsap.to(element, {
                                    opacity: 1 - fadeOutProgress,
                                    ease: "none",
                                    duration: 0
                                });
                            } else {
                                // Fully visible
                                gsap.to(element, {
                                    opacity: 1,
                                    ease: "none",
                                    duration: 0
                                });
                            }
                        } else {
                            // Element is outside its visible range
                            gsap.set(element, { visibility: "hidden", opacity: 0 });
                        }
                    });
                }
            });

            // Initial animations for elements
            animationContent.forEach(item => {
                const element = elementsRef.current[item.id];
                if (!element || !item.animationIn) return;

                gsap.fromTo(
                    element,
                    { ...item.animationIn.from, visibility: "hidden" },
                    {
                        visibility: "visible",
                        duration: item.animationIn.duration || 0.8,
                        ease: item.animationIn.ease || "power2.out",
                        delay: item.animationIn.delay || 0,
                        paused: true
                    }
                );
            });
        }

        return () => {
            // Proper cleanup
            window.removeEventListener('resize', resizeCanvas);

            // Kill ScrollTrigger instances properly
            if (scrollAnimation) {
                scrollAnimation.kill();
            }

            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === containerRef.current) {
                    st.kill();
                }
            });
        };
    }, [imagesLoaded]);

    // Helper function to render dynamic elements
    const renderElement = (item: AnimationItem) => {
        switch (item.type) {
            case 'heading':
                return (
                    <h2
                        key={item.id}
                        ref={el => { elementsRef.current[item.id] = el; }}
                        className={item.className}
                        style={{ visibility: 'hidden', opacity: 0 }}
                    >
                        {item.content}
                    </h2>
                );

            case 'paragraph':
                return (
                    <p
                        key={item.id}
                        ref={el => { elementsRef.current[item.id] = el; }}
                        className={item.className}
                        style={{ visibility: 'hidden', opacity: 0 }}
                    >
                        {item.content}
                    </p>
                );

            case 'button':
                return (
                    <motion.button
                        key={item.id}
                        ref={el => { elementsRef.current[item.id] = el; }}
                        className={item.className}
                        style={{ visibility: 'hidden', opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {item.content}
                    </motion.button>
                );

            case 'image':
                return (
                    <Image
                        key={item.id}
                        ref={el => { elementsRef.current[item.id] = el }}
                        src={item.content}
                        className={item.className}
                        style={{ visibility: 'hidden', opacity: 0 }}
                        alt={item.id}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div ref={containerRef} className="w-full bg-zinc-900 h-[700vh]">
                <div className="w-full sticky top-0 left-0 h-screen overflow-hidden">
                    {/* Canvas for animation frames */}
                    <canvas ref={canvasRef} className="w-full h-screen" />

                    {/* Text overlay */}
                    <div
                        ref={overlayRef}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 opacity-0"
                    >
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Render first section elements */}
                            <div className="mb-8">
                                {animationContent.filter(item => item.startFrame < 200).map(renderElement)}
                            </div>

                            {/* Render middle section elements */}
                            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-left max-w-md">
                                {animationContent.filter(item =>
                                    item.startFrame >= 200 && item.startFrame < 300
                                ).map(renderElement)}
                            </div>

                            {/* Render final section elements */}
                            <div className="mt-8">
                                {animationContent.filter(item => item.startFrame >= 300).map(renderElement)}
                            </div>
                        </div>
                    </div>

                    {/* Loading screen */}
                    {!imagesLoaded && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900">
                            <div className="text-white text-2xl mb-6">Loading your experience</div>
                            <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${loadingProgress}%` }}
                                />
                            </div>
                            <div className="text-zinc-400 mt-3">{loadingProgress}%</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center h-[100vh]">
                <h1 className="text-4xl text-white">Welcome to the Animation Experience</h1>
                <p className="text-zinc-400 mt-4">Scroll down to see the magic unfold...</p>
            </div>

        </>
    );
};

export default ScrollAnimation;
