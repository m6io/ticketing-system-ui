import { HiMiniSun, HiMiniMoon } from "react-icons/hi2";
import { useTheme } from "@/hooks/useTheme";
import { FaBugSlash } from "react-icons/fa6";
import useAuthStore from "@/store";
import { HiOutlineLogout } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-router-dom";

// A navbar component that will be used to house app-wide navigation and settings
export function Navbar() {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="flex h-16 items-center px-4 sm:px-8 lg:px-44">
        <div className="mx-auto w-full max-w-3xl space-y-20">
          <div className="flex justify-between">
            <Link
              className="flex flex-1 items-center justify-start"
              to={isAuthenticated ? "/tickets" : "/"}
            >
              {/* Link and site name/icon */}
              <div
                className="text-primary size-10 p-2"
                // to={isAuthenticated ? "/tickets" : "/"}
              >
                <FaBugSlash className="size-full" />
              </div>
              Bug Slash
            </Link>
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex items-center space-x-1">
                {/* Logout button */}

                {isAuthenticated && (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          useAuthStore.getState().logout();
                        }}
                        className="text-primary size-10 p-2 hover:text-muted-foreground"
                      >
                        <HiOutlineLogout className="h-full w-full" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Logout</TooltipContent>
                  </Tooltip>
                )}
                <ThemeToggle />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <button
          className="size-10 p-2 hover:text-amber-500 dark:hover:text-amber-400"
          onClick={() => toggleDarkMode()}
        >
          {isDarkMode ? (
            <HiMiniMoon className="h-full w-full" />
          ) : (
            <HiMiniSun className="h-full w-full" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {isDarkMode ? <p>Toggle light mode</p> : <p>Toggle dark mode</p>}
      </TooltipContent>
    </Tooltip>
  );
}
