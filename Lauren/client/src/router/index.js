import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/SystemAdmin/Dashboard'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/users',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    }
  ]
})
