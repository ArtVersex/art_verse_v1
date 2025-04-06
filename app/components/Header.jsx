// Header.jsx
import Link from "next/link";
import ClientSideHeader from "./ClientSideHeader";
import AuthContextProvider from "@/contexts/AuthContext";

export default function Header() {
  const menuList = [
    { name: "Home", link: "/", icon: "Home" },
    { name: "Contact Us", link: "/contact-us", icon: "Phone" },
    { name: "About Us", link: "/about-us", icon: "Info" },
  ];

  const actionButtons = [
    { name: "Search", link: "/search", icon: "Search" },
    { name: "Favorite", link: "/favorites", icon: "Heart" },
    { name: "Cart", link: "/cart", icon: "ShoppingCart" },
    { name: "Account", link: "/account", icon: "User" },
  ];

  return (
    <AuthContextProvider>

    <ClientSideHeader 
      menuList={menuList}
      actionButtons={actionButtons}
      />
      </AuthContextProvider>
  );
}