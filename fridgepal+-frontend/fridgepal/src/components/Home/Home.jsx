import React from "react";
import fish from "../../assets/fish.webp";
import drinks from "../../assets/drinks.jpg";
import fruits from "../../assets/fruits.webp";
import dairy from "../../assets/dairy.avif";

const items = [
  {
    name: "Dairy Products",
    image: dairy,
  },
  {
    name: "Fruits & Veggies",
    image: fruits,
  },
  {
    name: "Frozen Items",
    image: fish,
  },
  {
    name: "Snacks & Beverages",
    image: drinks,
  },
];

const Home = () => {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 py-16 px-4">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-16 relative">
        Fresh{" "}
        <span className="text-yellow-500 font-mono relative inline-block">
          Stocks
          <span className="block h-1 w-full bg-yellow-500 absolute -bottom-1 left-0 rounded"></span>
        </span>
      </h1>

      <div className="flex space-x-10 overflow-x-auto scrollbar-hide px-2 md:px-10 ">
        {items.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col items-center min-w-[280px] md:min-w-[320px]"
          >
            <div className="w-[300px] h-[300px] rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-500">
              <img
                src={item.image}
                alt={item.name}
                className="w-[250px] h-[250px] object-cover object-center rounded-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <h2 className="mt-6 text-yellow-500 text-lg md:text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
