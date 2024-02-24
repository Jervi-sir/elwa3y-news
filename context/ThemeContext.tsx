import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import KeyNames from "../utils/KeyNames";

const THEME_KEY = KeyNames.currentTheme;

const darkThemeColors = {
  background: '#121212',
  backgroundLight: '#191919',
  separator: '#2B2B2B',
  textPrimary: '#FFFFFF',
  textSecondary: '#808080',
  textSuccess: '#22B07E',
  tagBackground: '#292929',
  iconPrimary: '#646464',
  iconSecondary: '#646464',
  iconActive: '#D2D2D2',
  // warning colors
  textWarning: '#FF9800',  // Orange for warning text
  iconWarning: '#FF9800',  // Orange for warning icon
  backgroundWarning: '#3E3E3E',  // Darker background for warning elements
  // danger colors
  textDanger: '#FF4747',  // Red for danger text
  iconDanger: '#FF4747',  // Red for danger icon
  backgroundDanger: '#3E1F1F',  // Darker background for danger elements
  statusBar: '#121212'
};

const lightThemeColors = {
  // existing colors
  background: '#FFFFFF',
  backgroundLight: '#F5F5F5',
  separator: '#E0E0E0',
  textPrimary: '#121212',
  textSecondary: '#646464',
  textSuccess: '#0A804A',
  tagBackground: '#ECECEC',
  iconPrimary: '#646464',
  iconSecondary: '#646464',
  iconActive: '#121212',
  // warning colors
  textWarning: '#E65100',  // Orange for warning text
  iconWarning: '#E65100',  // Orange for warning icon
  backgroundWarning: '#FBE9E7',  // Lighter background for warning elements
  // danger colors
  textDanger: '#FF4747',  // Red for danger text
  iconDanger: '#FF4747',  // Red for danger icon
  backgroundDanger: '#3E1F1F',  // Darker background for danger elements
  statusBar: '#FFFFFF'

};

const ColorContext = createContext(null);

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default to dark
  const [Colors, setColors] = useState(darkThemeColors); // Default to dark theme colors

  useEffect(() => {
    const fetchThemeFromStorage = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme) {
          setCurrentTheme(storedTheme);
          setColors(storedTheme === 'dark' ? darkThemeColors : lightThemeColors);
        }
      } catch (e) {
        console.error('Failed to fetch theme from storage', e);
      }
    };

    fetchThemeFromStorage();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      setCurrentTheme(newTheme);
      setColors(newTheme === 'dark' ? darkThemeColors : lightThemeColors);
    } catch (e) {
      console.error('Failed to save theme to storage', e);
    }
  };

  return (
    <ColorContext.Provider value={{ Colors, toggleTheme, currentTheme }}>
      {children}
    </ColorContext.Provider>
  );
};



/*
    primary: '#637aff',
    primaryDark: '#2759ff',
    primaryLite: '#637aff99',
    black: '#000',
    white: 'white',
    accent: '#112233',
    greenMenu: '#22B07E',
    green: '#60c5a8',
    green2: '#039a83',
    light: '#EEEEEE',
    dark: '#333',
    gray: '#CCCCCC',
    red: '#ff2f68',
    lightRed: '#ff4f7e',
    darkRed: '#d9365e',
    purple: '#8f06e4',
    skyBlue: 'skyblue',
    yellow: '#f8c907',
    pink: '#ff4c98',
    gold: 'gold',
    line: '#282C35',
    grey: '#CCCCCC',
    lightGrey: '#F8F8F8',
    darkGrey: '#999999',

    darkOverlayColor: 'rgba(0, 0, 0, 0.2)',
    darkOverlayColor2: 'rgba(0, 0, 0, 0.8)',
    lightOverlayColor: 'rgba(255, 255, 255, 0.6)',
    primaryAlpha: 'rgba(99, 122, 255, 0.15)',
    redAlpha: 'rgba(255, 84, 84, 0.15)',
    greenAlpha: 'rgba(96, 197, 168, 0.15)',
    purpleAlpha: 'rgba(146, 6, 228, 0.15)',

    // bags background colors
    bag1Bg: '#ea7a72',
    bag2Bg: '#c2c5d1',
    bag3Bg: '#82a7c9',
    bag4Bg: '#d49d8f',
    bag5Bg: '#ccd9c6',
    bag6Bg: '#767676',
    bag7Bg: '#d1c8c3',
    bag8Bg: '#dca47f',
    bag9Bg: '#eb849c',
    bag10Bg: '#979dc1',
    bag11Bg: '#c7d3c0',
    */