import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Auth/Profile";
import ContactList from "./pages/Contact/ContactList";
import AddContact from "./pages/Contact/AddContact";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="contactlist" element={<ContactList />} />
          <Route path="addcontact" element={<AddContact />} />
        </Route></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
