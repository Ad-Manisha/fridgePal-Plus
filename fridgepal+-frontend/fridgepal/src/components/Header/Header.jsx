import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-md">
      <nav className="px-4 lg:px-8 py-3">
        <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} className="h-16 w-auto" alt="FridgePal Logo" />
          </Link>

          <div className="flex items-center lg:order-2">
            <Link
              to="/about"
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-full px-5 py-2 shadow transition-all duration-300"
            >
              Get Started
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:w-auto w-full lg:order-1 mt-4 lg:mt-0">
            <ul className="flex flex-col lg:flex-row gap-2 lg:gap-6 font-medium text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/items", label: "Items" },
                { to: "/trash", label: "Trash" },
                { to: "/recipes", label: "Recipes" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-orange-100 text-orange-700 font-semibold"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
