'use client';
import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * InfiniteScroller Component
 * 
 * A React component that provides an infinite scrolling effect for a set of child elements.
 * It supports drag, touch, and scroll interactions to navigate through the cards.
 * 
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child elements to be displayed in the scroller.
 * @param {string} [props.className] - Optional additional class names for the container.
 * 
 * @returns {JSX.Element} The InfiniteScroller component.
 * 
 * ## Features:
 * - Infinite scrolling through a set of cards.
 * - Supports mouse drag, touch gestures, and mouse wheel scrolling.
 * - Smooth animations using GSAP for transitions between cards.
 * - Snap-back effect when the drag/scroll threshold is not met.
 * 
 * ## Behavior:
 * - Cards are displayed in a vertical stack with the active card in the center.
 * - Dragging or scrolling up/down shifts the cards in the respective direction.
 * - Cards scale dynamically to indicate the active card.
 * 
 * ## Dependencies:
 * - `gsap` for animations.
 * 
 * ## Notes:
 * - Don't apply any layout manager except flex for this component.
 * 
 * ## Example Usage:
 * ```tsx
 * <InfiniteScroller className="custom-class">   //use max-h or max-w to limit the size, or leave it as is for full screen
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </InfiniteScroller>
 * ```
 */
export default function InfiniteScroller({ children, className }: { children: React.ReactNode, className?: string }) {
    const [cards] = useState<ReactNode[]>(Array.isArray(children) ? children : [children]);
    const [active, setActive] = useState(1);
    const [inAnimation, setInAnimation] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const snapper = useRef<NodeJS.Timeout | null>(null);
    const cardsRefs = useRef<Array<HTMLDivElement | null>>([]);

    // Scroll/Drag state
    const startY = useRef(0);
    const currentScrollY = useRef(0);
    const isScrolling = useRef(false);
    const dragThreshold = 500; // Pixels to trigger shift

    const shiftCards = useCallback((direction: 'up' | 'down') => {
        if (!containerRef.current || inAnimation) return;
        setInAnimation(true);

        const tl = gsap.timeline({
            onComplete: () => {
                setActive(prev => (prev + (direction === 'up' ? 1 : -1) + cards.length) % cards.length);
                setInAnimation(false);
            }
        });

        // Animate all cards simultaneously
        cardsRefs.current.forEach((cardRef, index) => {
            if (!cardRef) return;

            tl.to(cardRef, {
                y: direction === 'up' ? '-100%' : '100%',
                scale: index === 2 ? 0.9 : index === 2 + (direction === 'up' ? 1 : -1) ? 1 : 0.9,
                duration: 0.5,
                ease: 'power2.inOut',
            }, "<");
        });
    }, [cards, inAnimation]);

    useEffect(() => {
        if(inAnimation) return;
        cardsRefs.current.forEach((cardRef, index) => {
            if (!cardRef) return;
            gsap.set(cardRef, {
                y: '0%',
                scale: index === 2 ? 1 : 0.9
            });
        });
    }, [active]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleStart = (clientY: number) => {
            if (inAnimation) return;
            startY.current = clientY;
            currentScrollY.current = 0;
            isScrolling.current = true;
        };

        const handleMove = (clientY: number) => {
            if (!isScrolling.current || inAnimation) return;

            const diffY = clientY - startY.current;
            currentScrollY.current = diffY;

            // Apply visual scroll/drag effect
            cardsRefs.current.forEach((cardRef, index) => {
                if (!cardRef) return;
                gsap.set(cardRef, {
                    y: `${diffY}px`,
                    scale: index === 2 ? 1 : 0.9
                });
            });

            if (Math.abs(diffY) >= dragThreshold) {
                shiftCards(diffY > 0 ? 'down' : 'up');
                isScrolling.current = false;
            }
        };

        const handleEnd = () => {
            if (inAnimation) return;

            // Snap back if not enough scroll/drag
            if (Math.abs(currentScrollY.current) < dragThreshold) {
                cardsRefs.current.forEach((cardRef, index) => {
                    if (!cardRef) return;
                    gsap.to(cardRef, {
                        y: '0%',
                        scale: index === 2 ? 1 : 0.9,
                        duration: 0.3
                    });
                });
            }

            isScrolling.current = false;
        };

        // Mouse events
        const mouseDown = (e: MouseEvent) => {
            e.preventDefault();
            handleStart(e.clientY);
        };

        const mouseMove = (e: MouseEvent) => {
            e.preventDefault();
            handleMove(e.clientY);
        };

        const mouseUp = (e: MouseEvent) => {
            e.preventDefault();
            handleEnd();
        };

        // Touch events
        const touchStart = (e: TouchEvent) => {
            e.preventDefault();
            handleStart(e.touches[0].clientY);
        };

        const touchMove = (e: TouchEvent) => {
            e.preventDefault();
            handleMove(e.touches[0].clientY);
        };

        const touchEnd = (e: TouchEvent) => {
            e.preventDefault();
            handleEnd();
        };

        // Wheel event for mouse scrolling
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (inAnimation) return;

            // Accumulate scroll delta
            currentScrollY.current += e.deltaY;

            // Apply visual scroll effect
            cardsRefs.current.forEach((cardRef, index) => {
                if (!cardRef) return;
                gsap.to(cardRef, {
                    y: `${currentScrollY.current/10}px`,
                    scale: index === 2 ? 1 : 0.9,
                    duration: 0.1
                });
            });

            // Check if scroll threshold is reached
            
            if (Math.abs(currentScrollY.current)/3 >= dragThreshold) {
                if(snapper.current) clearTimeout(snapper.current);
                shiftCards(currentScrollY.current > 0 ? 'down' : 'up');
                currentScrollY.current = 0; // Reset after shifting
            } else {
                // If scrolled but not enough to shift, snap back
                if(snapper.current) clearTimeout(snapper.current);
                snapper.current = setTimeout(() => {
                    if (Math.abs(currentScrollY.current/10) < dragThreshold) {
                        if(inAnimation) return;
                        setInAnimation(true);
                        cardsRefs.current.forEach((cardRef, index) => {
                            if (!cardRef) return;
                            gsap.to(cardRef, {
                                y: '0%',
                                scale: index === 2 ? 1 : 0.9,
                                duration: 0.3,
                                onComplete: () => setInAnimation(false)
                            });
                            currentScrollY.current = 0;
                        });
                    }
                }, 100);
            }
        };

        // Add event listeners
        container.addEventListener('mousedown', mouseDown);
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        container.addEventListener('touchstart', touchStart, { passive: false });
        container.addEventListener('touchmove', touchMove, { passive: false });
        container.addEventListener('touchend', touchEnd, { passive: false });

        // Add wheel event listener
        container.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup
        return () => {
            container.removeEventListener('mousedown', mouseDown);
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);

            container.removeEventListener('touchstart', touchStart);
            container.removeEventListener('touchmove', touchMove);
            container.removeEventListener('touchend', touchEnd);

            container.removeEventListener('wheel', handleWheel);
        };
    }, [shiftCards, inAnimation]);

    return (
        <div
            className={`${className} h-screen w-screen flex flex-col items-center overflow-hidden bg-slate-900 relative select-none`}
            ref={containerRef}
        >
            <div className="absolute flex flex-col items-center justify-center w-[95%] h-screen">
                {[
                    (active - 2 + cards.length) % cards.length,
                    (active - 1 + cards.length) % cards.length,
                    active,
                    (active + 1) % cards.length,
                    (active + 2) % cards.length
                ].map((cardIndex, index) => (
                    <div
                        key={index}
                        ref={el => { cardsRefs.current[index] = el; }}
                        className={cn(`flex justify-center h-[80vh] w-full py-2 cursor-grab active:cursor-grabbing`,
                            index === 2 ? '' : 'scale-[0.9]'
                        )}
                    >
                        {cards.at(cardIndex)}
                    </div>
                ))}
            </div>
        </div>
    );
}