const paths = {
  circleDot: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" /><path d="M9 21v-6h6v6" /></>,
  gamepad: <><path d="M6.5 9h11A3.5 3.5 0 0 1 21 12.5v3a2.5 2.5 0 0 1-4.6 1.4L15 15H9l-1.4 1.9A2.5 2.5 0 0 1 3 15.5v-3A3.5 3.5 0 0 1 6.5 9Z" /><path d="M7 12v4M5 14h4M17 13h.01M19 15h.01" /></>,
  tv: <><rect x="3" y="5" width="18" height="13" rx="2" /><path d="m8 21 4-3 4 3M8 2l4 3 4-3" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.8c-1.1 1.1-2 1.5-2 3.2M12 17h.01" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  chart: <><path d="M4 19V5M4 19h17" /><path d="M8 16v-4M13 16V8M18 16v-7" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  cloud: <><path d="M7 18h10a4 4 0 0 0 .7-7.9A5.8 5.8 0 0 0 6.5 8.5 4.8 4.8 0 0 0 7 18Z" /><path d="M12 11v6M9.5 14.5 12 17l2.5-2.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  wallet: <><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v3H7a3 3 0 0 0 0 6h13v3a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5Z" /><path d="M20 9H7a3 3 0 0 0 0 6h13Z" /><path d="M16 12h.01" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  play: <path d="m8 5 11 7-11 7Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  twitter: <path d="M21 7.2c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.7-2.1 7.6 7.6 0 0 1-2.4.9A3.8 3.8 0 0 0 11.5 10c0 .3 0 .6.1.9a10.8 10.8 0 0 1-7.8-4 3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5 0 1.8 1.3 3.5 3.2 3.8-.5.1-1.1.2-1.7.1.5 1.6 2 2.7 3.7 2.7A7.7 7.7 0 0 1 3 19.7 10.8 10.8 0 0 0 8.8 21c7 0 10.8-5.8 10.8-10.8v-.5A7.7 7.7 0 0 0 21 7.2Z" />,
  linkedin: <><path d="M6 9v12M6 5v.01M11 21v-7a4 4 0 0 1 8 0v7M11 9v12" /></>,
};

function createIcon(name) {
  return function Icon({ size = 24, className = "", fill = "none", strokeWidth = 2, ...props }) {
    return <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>{paths[name]}</svg>;
  };
}

export const CircleDot = createIcon("circleDot"); export const Home = createIcon("home"); export const Gamepad2 = createIcon("gamepad"); export const Tv = createIcon("tv"); export const HelpCircle = createIcon("help"); export const Bell = createIcon("bell"); export const ChartBar = createIcon("chart"); export const User = createIcon("user"); export const CloudCog = createIcon("cloud"); export const Settings = createIcon("settings");
export const WalletCards = createIcon("wallet");
export const CalendarDays = createIcon("calendar");
export const Menu = createIcon("menu"); export const X = createIcon("close"); export const Play = createIcon("play"); export const Check = createIcon("check");
export const Facebook = createIcon("facebook"); export const Instagram = createIcon("instagram"); export const Twitter = createIcon("twitter"); export const Linkedin = createIcon("linkedin");
