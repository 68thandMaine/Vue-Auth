import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/Login';
import Register from '@/components/Register';
import UserBoard from '@/components/UserBoard';
import Admin from '@/components/Admin';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
      {
          path: '/',
          name: 'HelloWorld',
          component: HelloWorld
      },
      {
          path: '/login',
          name: 'login',
          component: Login,
          meta: {
              guest: true
          }
      },
      {
          path: '/register',
          name: 'register',
          component: Register,
          meta: {
              guest: true
          }
      },
      {
          path: '/dashboard',
          name: 'userboard',
          component: UserBoard,
          meta: {
              requiresAuth: true
          }
      },
      {
          path: '/admin',
          name: 'admin',
          component: Admin,
          meta: {
              requiresAuth: true,
              is_admin : true
          }
      },
  ]
})
  // The beforeEach method is called before each route is processed. The three parameters passed to it are to, from, and next.
  // To is where the user wishes to go
  // From is where the user is coming from
  // Next is a callback funtion that continues the processing order of the request
  router.beforeEach((to, from, next) => {
  // First conditional checks for a JSON web token
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'));
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.is_admin == 1) {
          next();
        } else {
          next({ name: 'userboard' });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next();
    } else {
      next({ name: 'userboard' });
    }
  } else {
    next();
  }
});
// The above function checks the to object to see if the route requriesAuth has a jwt token.
// Checks if route requiresAuth is for admin users, check for auth and if the the user is an admin
// Checks if the route requires guest if the user is logged in


export default router;
