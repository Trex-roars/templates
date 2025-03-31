'use client'

// ScrollAnimation.tsx
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import React, { useEffect, useRef, useState } from 'react';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationProps {
    title: string;
    subtitle?: string;
    frameCount: number;
    framePath: string; // Path to the frames directory
    framePrefix?: string; // Prefix for frame filenames
    frameExtension?: string; // File extension for frames
    frameDigits?: number; // Number of digits in frame numbering
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
    title,
    subtitle = '(scroll to see animation)',
    frameCount,
    framePath,
    framePrefix = 'frame_',
    frameExtension = 'jpg',
    frameDigits = 4,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const animRef = useRef({
        frame: 0,
        lastFrame: -1,
        totalFrames: frameCount,
    });

    // Preload images
    useEffect(() => {
        const images: HTMLImageElement[] = [];

        for (let i = 0; i <= frameCount; i++) {
            const img = new Image();
            const frameNumber = i.toString().padStart(frameDigits, '0');
            img.src = `${framePath}/${framePrefix}${frameNumber}.${frameExtension}`;
            images.push(img);
        }

        imagesRef.current = images;
    }, [frameCount, framePath, framePrefix, frameExtension, frameDigits]);

    // Draw frame to canvas
    const drawFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const frameIndex = Math.min(Math.floor(animRef.current.frame), frameCount);

        if (frameIndex === animRef.current.lastFrame) return;

        const img = imagesRef.current[frameIndex];
        if (img.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            animRef.current.lastFrame = frameIndex;
            setCurrentFrame(frameIndex);

            const progress = frameIndex / frameCount;
            setScrollProgress(progress);

            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const position = maxScroll * progress;
            setScrollPosition(position);
        }
    };

    // Initialize animation
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions
        canvas.width = 960;
        canvas.height = 540;

        // Create GSAP timeline
        const tl = gsap.timeline({
            paused: true,
            onUpdate: drawFrame,
        });

        tl.to(animRef.current, {
            duration: 1,
            frame: frameCount,
            ease: "none",
            snap: "frame",
        });

        timelineRef.current = tl;

        // Create ScrollTrigger
        const trigger = ScrollTrigger.create({
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                if (timelineRef.current) {
                    timelineRef.current.progress(self.progress);
                }
            }
        });

        // Draw the first frame
        drawFrame();

        return () => {
            if (trigger) trigger.kill();
            if (tl) tl.kill();
        };
    }, [frameCount]);

    // Handle playback controls
    const handlePlay = () => {
        if (!timelineRef.current) return;
        timelineRef.current.play();
        setIsPlaying(true);
    };

    const handlePause = () => {
        if (!timelineRef.current) return;
        timelineRef.current.pause();
        setIsPlaying(false);
    };

    const handleResume = () => {
        if (!timelineRef.current) return;
        timelineRef.current.resume();
        setIsPlaying(true);
    };

    const handleReverse = () => {
        if (!timelineRef.current) return;
        timelineRef.current.reverse();
        setIsPlaying(true);
    };

    const handleRestart = () => {
        if (!timelineRef.current) return;
        timelineRef.current.restart();
        setIsPlaying(true);
    };

    const handleJumpToFrame = (frame: number) => {
        if (!timelineRef.current) return;
        const progress = frame / frameCount;
        timelineRef.current.progress(progress);

        // Scroll to matching position
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * progress);

        timelineRef.current.pause();
        setIsPlaying(false);
    };

    // Handle slider change
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!timelineRef.current) return;
        const progress = parseFloat(e.target.value);
        timelineRef.current.progress(progress);

        // Scroll to matching position
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * progress);

        timelineRef.current.pause();
        setIsPlaying(false);
    };

    return (
        <>
            {/* This div creates space for scrolling */}
            <div className="h-[5000px] bg-black" />

            <canvas ref={canvasRef} className="fixed w-[960px] h-[540px] max-w-screen max-h-screen mx-auto left-1/2 -translate-x-1/2" />

            <div className="fixed w-[960px] h-[620px] top-0 left-1/2 -translate-x-1/2">
                <div className="text-center text-white w-full mx-auto p-0 translate-y-5 z-10">
                    <h1 className="border-5 border-black text-2xl leading-tight uppercase m-0 p-1">{title}</h1>
                    <p className="text-base m-0 p-0">{subtitle}</p>
                </div>

                <div className="w-full fixed translate-y-[480px]">
                    <div className="m-0 pb-5">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.001"
                            value={scrollProgress}
                            onChange={handleSliderChange}
                            className="w-full"
                        />
                    </div>

                    <div className="text-3xl text-center text-white m-0 py-2.5">
                        <button onClick={() => handleJumpToFrame(0)} className="text-sm h-8 m-0 px-1.5">Jump to BEGINNING (fr 0)</button>
                        <button onClick={() => handleJumpToFrame(10)} className="text-sm h-8 m-0 px-1.5">Jump to fr 10</button>
                        <button onClick={() => handleJumpToFrame(50)} className="text-sm h-8 m-0 px-1.5">Jump to fr 50</button>
                        <button onClick={() => handleJumpToFrame(Math.floor(frameCount / 2))} className="text-sm h-8 m-0 px-1.5">
                            Jump to MIDDLE (fr {Math.floor(frameCount / 2)})
                        </button>
                        <button onClick={() => handleJumpToFrame(Math.floor(frameCount * 0.6))} className="text-sm h-8 m-0 px-1.5">
                            Jump to fr {Math.floor(frameCount * 0.6)}
                        </button>
                        <button onClick={() => handleJumpToFrame(Math.floor(frameCount * 0.8))} className="text-sm h-8 m-0 px-1.5">
                            Jump to fr {Math.floor(frameCount * 0.8)}
                        </button>
                        <button onClick={() => handleJumpToFrame(frameCount - 1)} className="text-sm h-8 m-0 px-1.5">
                            Jump to END (fr {frameCount - 1})
                        </button>
                    </div>

                    <div className="text-3xl text-center text-white m-0 py-2.5">
                        <button onClick={handlePlay} className="text-sm h-8 m-0 px-1.5">play()</button>
                        <button onClick={handlePause} className="text-sm h-8 m-0 px-1.5">pause()</button>
                        <button onClick={handleResume} className="text-sm h-8 m-0 px-1.5">resume()</button>
                        <button onClick={handleReverse} className="text-sm h-8 m-0 px-1.5">reverse()</button>
                        <button onClick={handleRestart} className="text-sm h-8 m-0 px-1.5">restart</button>
                    </div>
                </div>

                <div className="font-mono text-white w-3/10 h-[60px] m-0 p-0 relative translate-y-[400px] float-right z-10">
                    <p className="border border-gray-800 text-base w-full h-1/3 m-0 p-0 absolute right-0">frame: {currentFrame}</p>
                    <p className="border border-gray-800 text-base w-full h-1/3 m-0 p-0 absolute right-0 top-1/3">scrollProgress: {scrollProgress.toFixed(3)}</p>
                    <p className="border border-gray-800 text-base w-full h-1/3 m-0 p-0 absolute right-0 top-2/3">scrollPosition: {Math.round(scrollPosition)}</p>
                </div>
            </div>
        </>
    );
};

export default ScrollAnimation;
