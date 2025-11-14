import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Profile from "./pages/Auth/Profile";
import ContactList from "./pages/Contact/ContactList";
import AddContact from "./pages/Contact/AddContact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProtectedRoute from "./context/ProtectedRoute";
import EditContact from "./pages/Contact/EditContact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="/contactlist" element={<ContactList />} />
          <Route path="/addcontact" element={<AddContact />} />
          <Route path="/contacts/edit/:id" element={<EditContact />} />
          </Route></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
