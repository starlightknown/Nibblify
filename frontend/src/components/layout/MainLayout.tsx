import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineDocument,
  HiOutlineCog,
  HiOutlineArchive,
  HiOutlineTrash,
  HiOutlineChartBar,
  HiMoon,
  HiSun
} from 'react-icons/hi';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/documents', label: 'Documents', icon: HiOutlineDocument },
    { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
    { path: '/archived', label: 'Archived', icon: HiOutlineArchive },
    { path: '/trash', label: 'Trash', icon: HiOutlineTrash },
    { path: '/settings', label: 'Settings', icon: HiOutlineCog },
  ];

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {/* Logo */}
          <div className="p-6">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Nibblify</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm ${
                  isActive(item.path)
                    ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600'
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                }`}
              >
                <span className="mr-3">
                  <item.icon size={20} />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Dark Mode Toggle */}
          <div className="absolute bottom-0 w-full p-6">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>Dark Mode</span>
              {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default MainLayout; 