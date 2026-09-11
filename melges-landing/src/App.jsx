import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./sections/Hero.jsx";
import GamesShowcase from "./sections/GamesShowcase.jsx";
import Services from "./sections/Services.jsx";
import About from "./sections/About.jsx";
import Process from "./sections/Process.jsx";
import Projects from "./sections/Projects.jsx";
import Footer from "./sections/Footer.jsx";
import AuthPage, { getStoredSession } from "./views/AuthPage.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AdminPanel from "./views/AdminPanel.jsx";

export default function App() {
  const [user, setUser] = useState(getStoredSession);
  const [activeSection, setActiveSection] = useState("home");
  const [loginOpen, setLoginOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const openPrivateArea = (section = "projects") => {
    if (!user) return setLoginOpen(true);
    setActiveSection(section);
  };
  const logout = () => { sessionStorage.removeItem("melges-session"); setUser(null); setActiveSection("home"); };
  return (
    <div className="relative min-h-screen bg-ink-950">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} activeSection={activeSection} loggedIn={Boolean(user)} isAdmin={Boolean(user?.isAdmin)} onNavigate={(section) => { section === "home" ? setActiveSection("home") : openPrivateArea(section); }} />

      <div className={`transition-[padding] duration-300 ${sidebarOpen ? "lg:pl-72" : "lg:pl-28"}`}>
        <Navbar onProjects={() => openPrivateArea("projects")} onHome={() => setActiveSection("home")} />
        {activeSection === "home" ? <><main><Hero onRegisterProject={() => openPrivateArea("projects")} /><GamesShowcase /><Services onRegisterProject={() => openPrivateArea("projects")} /><About /><Process /><Projects onRegisterProject={() => openPrivateArea("projects")} /></main><Footer /></> : user?.isAdmin && ["admin", "overview", "projects"].includes(activeSection) ? <AdminPanel view={activeSection} /> : <><Dashboard section={activeSection} user={user} onLogout={logout} />{activeSection === "projects" && user?.isAdmin && <div className="fixed bottom-5 right-5 z-50"><button type="button" onClick={() => setActiveSection("admin")} className="btn-outline border-violet/50 bg-ink-900/95 shadow-lg">Gerenciar solicitações</button></div>}</>}
      </div>
      {loginOpen && <AuthPage onBack={() => setLoginOpen(false)} onAuthenticated={(account) => { setUser(account); setLoginOpen(false); setActiveSection("projects"); }} />}
    </div>
  );
}
