import InfiniteScroller from "./comps/InfiniteScroller";

export default function Home() {
  return (
    <InfiniteScroller>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={0}>
        <img src="/moviePoster.jpg" alt="" className="h-full w-full" />
      </div>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={1}>
        <img src="/moviePoster2.webp" alt="" className="h-full w-full" />
      </div>

      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={0}>
        <img src="/movie3.jpg" alt="" className="h-full w-full" />
      </div>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={0}>
        <img src="/movie4.jpg" alt="" className="h-full w-full" />
      </div>


    </InfiniteScroller>
  );
}
