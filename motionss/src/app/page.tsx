import DistortImageCanvas from '@/components/Distot';

export default function DistortPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[50%] h-screen">
        {/* <DistortImageCanvas  /> */}
        <DistortImageCanvas
          canvasImage="https://images.unsplash.com/photo-1742445134107-f88f41be10ed?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </div>
  );
}
