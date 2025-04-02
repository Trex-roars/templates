import InfiniteScroller from "./comps/InfiniteScroller";

export default function Home() {
  return (
    <InfiniteScroller>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={0}>
        <img src="https://images.unsplash.com/photo-1737039226838-fb0156d89672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D" alt="" className="h-full w-fit" />
      </div>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={1}>
        <img src="https://images.unsplash.com/photo-1737039226838-fb0156d89672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D" alt="" className="h-full w-fit" />
      </div>

      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={2}>
        <img src="https://images.unsplash.com/photo-1737039226838-fb0156d89672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D" alt="" className="h-full w-fit" />
      </div>
      <div className="w-[95%] min-h-[80vh] rounded-4xl overflow-hidden flex items-center justify-center card" key={3}>
        <img src="https://images.unsplash.com/photo-1737039226838-fb0156d89672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D" alt="" className="h-full w-fit " />
      </div>


    </InfiniteScroller>
  );
}
