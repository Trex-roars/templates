export interface AnimationItem {
    id: string;
    type: 'heading' | 'paragraph' | 'button' | 'image' | 'custom';
    content: string;
    className?: string;
    startFrame: number;
    endFrame: number;
    animationIn?: {
        from: gsap.TweenVars;
        duration?: number;
        ease?: string;
        delay?: number;
    };
    animationOut?: {
        to: gsap.TweenVars;
        duration?: number;
        ease?: string;
    };
    parallax?: {
        intensity: number;
        direction: 'x' | 'y';
    };
}



export const animationContent: AnimationItem[] = [
    {
        id: "mainTitle",
        type: "heading",
        content: "Experience the Future",
        className: "text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg",
        startFrame: 1,
        endFrame: 100,
        animationIn: {
            from: { y: 50, opacity: 0 },
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.2
        },
        animationOut: {
            to: { y: -50, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        },
        parallax: {
            intensity: 50,
            direction: "y"
        }
    },
    {
        id: "mainSubtitle",
        type: "paragraph",
        content: "Scroll to discover our revolutionary approach to innovation and design",
        className: "text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md",
        startFrame: 10,
        endFrame: 180,
        animationIn: {
            from: { y: 30, opacity: 0 },
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.4
        },
        animationOut: {
            to: { y: -30, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        },
        parallax: {
            intensity: 30,
            direction: "y"
        }
    },
    {
        id: "getStartedButton",
        type: "button",
        content: "Get Started",
        className: "px-8 py-3 bg-white text-zinc-900 rounded-full text-lg font-medium hover:bg-opacity-90 transition-all",
        startFrame: 20,
        endFrame: 160,
        animationIn: {
            from: { y: 30, opacity: 0 },
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.6
        },
        animationOut: {
            to: { y: -30, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        }
    },
    {
        id: "learnMoreButton",
        type: "button",
        content: "Learn More",
        className: "px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium ml-4 hover:bg-white/10 transition-all",
        startFrame: 20,
        endFrame: 160,
        animationIn: {
            from: { y: 30, opacity: 0 },
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.8
        },
        animationOut: {
            to: { y: -30, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        }
    },
    {
        id: "midJourneySection",
        type: "heading",
        content: "Innovative Technology",
        className: "text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg",
        startFrame: 100,
        endFrame: 300,
        animationIn: {
            from: { x: -100, opacity: 0 },
            duration: 0.8,
            ease: "power3.out"
        },
        animationOut: {
            to: { x: 100, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        },
        parallax: {
            intensity: 40,
            direction: "x"
        }
    },
    {
        id: "midJourneyDescription",
        type: "paragraph",
        content: "Our cutting-edge solutions revolutionize how you interact with the digital world",
        className: "text-lg md:text-xl text-white/90 max-w-md drop-shadow-md",
        startFrame: 210,
        endFrame: 290,
        animationIn: {
            from: { x: -80, opacity: 0 },
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2
        },
        animationOut: {
            to: { x: 80, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        },
        parallax: {
            intensity: 25,
            direction: "x"
        }
    },
    {
        id: "finalSection",
        type: "heading",
        content: "Join Us Today",
        className: "text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg",
        startFrame: 300,
        endFrame: 380,
        animationIn: {
            from: { scale: 0.8, opacity: 0 },
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        },
        animationOut: {
            to: { scale: 1.2, opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        }
    },
    {
        id: "finalCta",
        type: "paragraph",
        content: "Be part of the revolution that's changing the future",
        className: "text-xl text-white/90 max-w-lg mx-auto drop-shadow-md",
        startFrame: 310,
        endFrame: 370,
        animationIn: {
            from: { opacity: 0 },
            duration: 0.8,
            ease: "power2.out",
            delay: 0.3
        },
        animationOut: {
            to: { opacity: 0 },
            duration: 0.5,
            ease: "power2.in"
        }
    }
];
