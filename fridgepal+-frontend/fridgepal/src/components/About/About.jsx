import about from "../../assets/logo3.jpg";

export default function About() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
      
          <div className="lg:w-6/12 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900  mb-16 relative select-none">
              About{" "}
              <span className="text-yellow-500 font-mono relative inline-block">
                FridgePal
                <span className="block h-1 w-full bg-yellow-500 absolute -bottom-1 left-0 rounded" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              FridgePal is your smart fridge assistant that helps you track
              groceries, reduce food waste, and get reminders before your items
              expire.
            </p>

            <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-indigo-200 max-w-xl mx-auto lg:mx-0">
              <p className="text-gray-900 font-semibold text-lg mb-5">
                Built with{" "}
                <span className="font-bold text-indigo-600">React</span> &{" "}
                <span className="font-bold text-rose-600">FastAPI</span>,
                FridgePal helps you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-3 pl-5 text-base sm:text-lg">
                <li>🧊 Manage fridge items with expiry reminders</li>
                <li>🥗 Track what you've eaten or discarded</li>
                <li>⏰ Get alerts for soon-to-expire items</li>
                <li>📦 Stay organized and reduce food waste</li>
              </ul>
            </div>
          </div>

         
          <div className="lg:w-6/12 w-full max-w-md mx-auto lg:mx-0">
            <img
              src={about}
              alt="foods stored in fridge"
              className="w-full rounded-3xl object-cover shadow-2xl border-8 border-white transition-transform duration-500 hover:scale-[1.03]"
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
