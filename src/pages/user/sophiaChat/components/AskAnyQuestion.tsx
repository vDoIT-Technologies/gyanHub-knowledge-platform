import { Card } from "@/components/ui/card";
const AskAnyQuestion = () => {
  return (
    <div className="flex flex-col z-10 gap-4 justify-end md:justify-center items-center absolute bottom-24 md:bottom-0 md:my-auto w-full md:max-w-2xl overflow-hidden h-full">
      <h3>Ask anything</h3>
      <div className="flex flex-row gap-2 w-full pb-4">
        <div className="flex justify-center border border-primary backdrop-blur-lg rounded-md py-3 min-w-44 w-full">
          <p>Latest Advancement in AI?</p>
        </div>
        <div className="flex justify-center border border-primary backdrop-blur-lg rounded-md  py-3 min-w-52 w-full">
          <p>Concept of quantum computing</p>
        </div>
      </div>
    </div>
  );
};

export default AskAnyQuestion;
