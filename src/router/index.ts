import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userStore } from '@/store/user';

// 擴充 router 型別
type RouteCustomer = RouteRecordRaw & {
  meta?: {
    auth: string
  };
}

const routes: Array<RouteCustomer> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      auth: 'DB-basic',
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      auth: 'DB-basic',
    }
  },
  {
    path: "/404",
    name: "不存在的頁面",
    component: () => import("../views/404View.vue"),
  },
  {
    path:'/:catchAll(.*)',
    redirect: '/404'
  },
  {
    path: '/NintendoView',
    name: 'NintendoView',
    component: () => import('../customer/Nintendo/NintendoView.vue'),
    meta: {
      auth: 'DB-N000',
    }
  },
  // {
  //   path: '/NintendoCreateChartView',
  //   name: 'NintendoCreateChartView',
  //   component: () => import('../customer/Nintendo/NintendoCreateChartView.vue'),
  //   meta: {
  //     auth: 'DB-N001',
  //   }
  // },
  {
    path: '/SonyView',
    name: 'SonyView',
    component: () => import('../customer/Sony/SonyView.vue'),
    meta: {
      auth: 'DB-S000',
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next)=>{
  const useUserStore = userStore();

  // 有此頁面權限
  if( !Object.prototype.hasOwnProperty.call(to.meta, 'auth') || useUserStore.auth.includes(to.meta.auth as string) ){
    next();

  // 無此權限
  } else {
    next({name: '不存在的頁面'})
  }
});


export default router
