// pages/animation.tsx or app/animation/page.tsx (depending on Next.js version)
'use client'

import Ani from './ani';

export default function AnimationPage() {
  return (
    <>
      {/* Only use Head in Pages Router, not App Router */}
      {/* <Head>
        <title>Scroll Animation</title>
        <meta name="description" content="GSAP Scroll-based animation" />
      </Head>

      <ScrollAnimation
        title="SquirrelBit Just Wants To Be Part of the Hive..."
        frameCount={149}
        framePath="../../framess"
        framePrefix="frame_"
        frameExtension="jpg"
        frameDigits={4}
      /> */}

      <Ani />
    </>
  );
}
