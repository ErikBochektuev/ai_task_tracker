
import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const LoginPage = () => import('@/Pages/LoginPage.vue')
const RegisterPage = () => import('@/Pages/RegisterPage.vue')
const ProjectsPage = () => import('@/Pages/ProjectsPage.vue')
const Profile = () => import('@/Pages/Profile.vue')
const NotFound = () => import('@/Pages/NotFound.vue')
const invitePage = () => import('@/Pages/invitePage.vue')
const resetPassword = () => import('@/Pages/resetPasswordPage.vue')
const categoriesPage = () => import('@/Pages/categoriesPage.vue')


const routes = [
  {
    path: '/', 
    redirect: '/categories', 
    meta: { requiresAuth: true } 
  },
  {
    path: '/users/invite',
    name: 'invitePage',
    component: invitePage,
    meta: {
      requiresAuth: false,
      title: 'Вас пригласили в проект'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { 
      requiresAuth: false,
      title: 'Вход в систему' 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { 
      requiresAuth: false,
      title: 'Регистрация'
    }
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: resetPassword,
    meta: {
      requiresAuth: false,
      title: 'Восстановление пароля'
    }
  },
  {
    path: '/profile',
    name: 'profilePage',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: 'Ваш профиль'
    }
  },
  {
    path: '/categories',
    name: 'categoriesPage',
    component: categoriesPage,
    meta: {
      requiresAuth: true,
      title: 'Категории'
    }
  },
  {
    path: '/project/:id',
    name: 'projectsPage',
    component: ProjectsPage,
    props: true,
    meta: { 
      requiresAuth: true, 
      title: 'Проекты'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { 
      requiresAuth: true,
      title: 'Профиль пользователя'
    }
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: NotFound,
    meta: { 
      requiresAuth: false,
      title: 'Страница не найдена'
    }
  }
]


const router = createRouter({
  history: createWebHistory(),
  
  routes,
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition 
    } else {
      return { top: 0 } 
    }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  const isAuthenticated = authStore.isAuth
  
  if (to.meta.title) {
    document.title = `${to.meta.title} | Мое Приложение`
  }
  
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('Неавторизованный доступ к защищенному маршруту:', isAuthenticated)
      next({ 
        name: 'Login',
        query: { redirect: to.fullPath } 
      })
    } else {
      next()
    }
  } 
  else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'categoriesPage' })
  } 
  else {
    next()
  }
})

router.afterEach((to, from) => {
  console.log(`Переход с ${from.fullPath} на ${to.fullPath}`)
})

export default router