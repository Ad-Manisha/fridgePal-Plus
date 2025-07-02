import { useEffect, useState } from "react";
import axios from "axios";

export default function Recipes() {
  const API = import.meta.env.VITE_API_URL;
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/recipes/suggestions`)
      .then((res) => {
        setIngredients(res.data.available_ingredients || []);
        setRecipes(res.data.recipes || []);
      })
      .catch(() => {
        setIngredients([]);
        setRecipes([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-12 border border-rose-300">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800 mb-16 relative select-none">
          Recipe{" "}
          <span className="text-yellow-500 font-mono relative inline-block">
            Suggestions
            <span className="block h-1 w-full bg-yellow-500 absolute -bottom-1 left-0 rounded" />
          </span>
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 select-none">
            Available Ingredients:
          </h2>
          <div className="flex flex-wrap gap-3">
            {ingredients.length === 0 ? (
              <p className="text-gray-500 italic">No ingredients found.</p>
            ) : (
              ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-sm font-semibold shadow-sm select-none transition-colors hover:bg-emerald-200 cursor-default"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="grid gap-10">
          {recipes.length === 0 ? (
            <p className="text-center text-gray-500 italic select-none text-lg">
              No matching recipes found.
            </p>
          ) : (
            recipes.map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-gray-200 shadow-md p-8 hover:shadow-lg transition-shadow duration-300 cursor-default"
              >
                <h3 className="text-3xl font-bold text-rose-700 mb-4 select-none">
                  {recipe.name}
                </h3>
                <p className="text-base text-gray-700 mb-3 leading-relaxed">
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </p>
                <p className="text-sm text-gray-600 italic whitespace-pre-line select-text leading-relaxed">
                  {recipe.instructions}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
