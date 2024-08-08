import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import classNames from "classnames";

const ThemeContext = createContext();
const ThemeUpdateContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeUpdate() {
  return useContext(ThemeUpdateContext);
}

const ThemeProvider = ({ ...props }) => {
  const defaultTheme = {
    main: "default", //other value can be passed "bordered"
    sidebar: "white", //other value can be passed "light,dark,theme"
    sidebarCompact: false,
    sidebarVisibility: false,
    sidebarMobile: false,
    header: "white", //other value can be passed "light,dark,theme"
    skin: "light", //other value can be passed "dark"
  };
  const [theme, setTheme] = useState(defaultTheme);

  const themeUpdate = {
    uistyle: function (value) {
      setTheme({ ...theme, main: value });
    },
    sidebar: function (value) {
      setTheme({ ...theme, sidebar: value });
    },
    sidebarCompact: function (e) {
      setTheme({ ...theme, sidebarCompact: !theme.sidebarCompact });
    },
    sidebarVisibility: function (e) {
      setTheme({ ...theme, sidebarVisibility: !theme.sidebarVisibility });
    },
    sidebarHide: function (e) {
      setTheme({ ...theme, sidebarVisibility: false });
    },
    header: function (value) {
      setTheme({ ...theme, header: value });
    },
    skin: function (value) {
      setTheme({ ...theme, skin: value });
    },
    reset: function (e) {
      setTheme({
        ...theme,
        main: defaultTheme.main,
        sidebar: defaultTheme.sidebar,
        header: defaultTheme.header,
        skin: defaultTheme.skin,
      });
    },
  };

  const bodyClass = classNames({
    "nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme": true,
  });

  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const body = document.querySelector("body");
    body.className = bodyClass;
  }, [bodyClass]);

  useEffect(() => {
    const body = document.querySelector("body");
    if (theme.main === "default") {
      body.classList.add("ui-default");
      body.classList.remove("ui-bordered");
    }
    if (theme.main === "bordered") {
      body.classList.add(`ui-bordered`);
      body.classList.remove("ui-default");
    }
    if (theme.skin === "dark") {
      body.classList.add(`dark-mode`);
    } else {
      body.classList.remove("dark-mode");
    }
    if (theme.sidebarVisibility === true) {
      body.classList.add("nav-shown");
    } else {
      body.classList.remove("nav-shown");
    }
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    const resizeObserverCallback = (entries) => {
      const width = entries[0].contentRect.width;
      setTheme((prevTheme) => {
        if (width < 1200) {
          return { ...prevTheme, sidebarMobile: true, sidebarVisibility: false };
        } else {
          return { ...prevTheme, sidebarMobile: false, sidebarVisibility: false };
        }
      });
    };

    resizeObserverRef.current = new ResizeObserver(resizeObserverCallback);
    resizeObserverRef.current.observe(body);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={themeUpdate}>{props.children}</ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
