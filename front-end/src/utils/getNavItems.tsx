// src/utils/getNavItems.tsx

const getNavItems = (isLoggedIn, isAdmin) => {
  const commonItems = [
    {
      name: 'Home',
      path: '/',
      requiresLogin: false,
      adminOnly: false,
      hideWhenLoggedIn: false,
    },
    {
      name: 'About',
      path: '/about',
      requiresLogin: false,
      adminOnly: false,
      hideWhenLoggedIn: false,
    },
  ];

  const guestItems = [
    {
      name: 'Login',
      path: '/login',
      requiresLogin: false,
      adminOnly: false,
      hideWhenLoggedIn: true,
    },
    {
      name: 'Signup',
      path: '/signup',
      requiresLogin: false,
      adminOnly: false,
      hideWhenLoggedIn: true,
    },
  ];

  const userItems = [
    {
      name: 'Logout',
      path: '/logout',
      requiresLogin: true,
      adminOnly: false,
      hideWhenLoggedIn: false,
    },
    {
      name: 'Account',
      path: '/account',
      requiresLogin: true,
      adminOnly: false,
      hideWhenLoggedIn: false,
    },
  ];

  const adminItems = [
    {
      name: 'Admin',
      path: '/admin',
      requiresLogin: true,
      adminOnly: true,
      hideWhenLoggedIn: false,
    },
  ];

  return [
    ...commonItems,
    ...(isLoggedIn ? userItems : guestItems),
    ...(isAdmin ? adminItems : []),
  ];
};

export default getNavItems;
