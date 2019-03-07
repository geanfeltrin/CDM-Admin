import React from "react";
import DashboardPage from "../pages/DashboardPage";
import SideNavigation from "./sideNavigation";

import UsersPage from "../pages/UsersPage";
import PostPage from "../pages/PostPage/PostPage.js";
import NotFoundPage from "../pages/NotFoundPage";
import CategoryPage from "../pages/CategoryPage";
const admin = [
  {
    path: "/",
    exact: true,
    sidebar: () => <SideNavigation />,
    main: () => <DashboardPage />
  },
  {
    path: "/users",
    sidebar: () => <SideNavigation />,
    main: () => <UsersPage />
  },
  {
    path: "/category",
    sidebar: () => <SideNavigation />,
    main: () => <CategoryPage />
  },
  {
    path: "/post",
    sidebar: () => <SideNavigation />,
    main: () => <PostPage />
  },

  {
    path: "/404",
    sidebar: () => <SideNavigation />,
    main: () => <NotFoundPage />
  }
];

export default admin;
