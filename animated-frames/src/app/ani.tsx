import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef, useState } from "react";

// Define proper types
interface ImageRef {
    current: HTMLImageElement[];
}

const Ani: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const subtitleRef = useRef<HTMLParagraphElement | null>(null);
    const ctaRef = useRef<HTMLDivElement | null>(null);
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
                const img = new Image();
                img.src = `/framess/frame_${i.toString().padStart(4, '0')}.jpg`;

                img.onload = () => {
                    if (!isMounted) return;

                    loadedCount++;
                    const progress = Math.floor((loadedCount / (frameCount - 1)) * 100);
                    setLoadingProgress(progress);

                    if (loadedCount === frameCount - 1) {
                        setImagesLoaded(true);

                        // Animate in the content once loaded
                        const tl = gsap.timeline();
                        if (overlayRef.current) {
                            tl.to(overlayRef.current, {
                                opacity: 1,
                                duration: 1,
                                ease: "power2.inOut"
                            });
                        }

                        if (titleRef.current && subtitleRef.current && ctaRef.current) {
                            tl.from([titleRef.current, subtitleRef.current, ctaRef.current], {
                                y: 50,
                                opacity: 0,
                                stagger: 0.2,
                                duration: 0.8,
                                ease: "back.out(1.7)"
                            }, "-=0.5");
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

                    // Parallax effect for the overlay text
                    if (titleRef.current && subtitleRef.current) {
                        gsap.to(titleRef.current, {
                            y: self.progress * 50,
                            ease: "none",
                            duration: 0
                        });

                        gsap.to(subtitleRef.current, {
                            y: self.progress * 30,
                            ease: "none",
                            duration: 0
                        });
                    }

                    // Fade out overlay as user scrolls down
                    if (overlayRef.current) {
                        gsap.to(overlayRef.current, {
                            opacity: 1 - (self.progress * 1.5 > 1 ? 1 : self.progress * 1.5),
                            ease: "none",
                            duration: 0
                        });
                    }
                }
            });

            // Initialize text typing animation
            if (titleRef.current) {
                const typingAnimation = gsap.to(titleRef.current, {
                    paused: true,
                    duration: 2,
                    ease: "none",
                    onComplete: () => {
                        if (subtitleRef.current) {
                            gsap.to(subtitleRef.current, {
                                opacity: 1,
                                duration: 0.8,
                                delay: 0.2
                            });
                        }

                        if (ctaRef.current) {
                            gsap.to(ctaRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                delay: 0.4
                            });
                        }
                    }
                });

                typingAnimation.play();
            }
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

    return (
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
                        <h1
                            ref={titleRef}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                        >
                            Experience the Future
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto opacity-0 drop-shadow-md"
                        >
                            Scroll to discover our revolutionary approach to innovation and design
                        </p>

                        <div
                            ref={ctaRef}
                            className="mt-8 opacity-0 transform translate-y-10"
                        >
                            <motion.button
                                className="px-8 py-3 bg-white text-zinc-900 rounded-full text-lg font-medium hover:bg-opacity-90 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started
                            </motion.button>
                            <motion.button
                                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium ml-4 hover:bg-white/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Learn More
                            </motion.button>
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
    );
};

export default Ani;
