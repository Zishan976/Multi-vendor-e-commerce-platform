import Title from "./Title";

const NewsLetter = () => {
  return (
    <div>
      <Title
        title="Join Newsletter"
        description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
        visibleButton={false}
      />
      <div className="flex bg-slate-100 text-sm p-1 max-w-xl rounded-full my-10 mx-auto border-2 border-white ring ring-slate-200">
        <input
          className="flex-1 pl-5 outline-none"
          type="text"
          placeholder="Enter your email address"
        />
        <button className="font-medium bg-green-500 text-white px-7 py-3 rounded-full hover:bg-green-600 hover:scale-103 active:scale-95 transition cursor-pointer">
          Get Updates
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
