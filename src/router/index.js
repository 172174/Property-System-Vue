import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import axios from '../axios'
import store from '../store/index'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        meta: { title: '首页', icon: 'el-icon-s-platform' },
        component: (resolve) => require([`@/views/Home.vue`], resolve),
        children: [{
                path: '/',
                name: 'Index',
                meta: { title: '首页', icon: 'product-add' },
                component: (resolve) => require([`@/views/Index.vue`], resolve),

            },
            {
                path: '/hms/details/HouseDetails',
                name: 'HouseDetails',
                meta: { title: '住房详情', icon: 'product-add' },
                component: (resolve) => require([`@/views/hms/details/HouseDetails.vue`], resolve),
            },
            {
                path: '/ems/details/OrderDetail',
                name: 'OrderDetails',
                meta: { title: '费用详情', icon: 'product-add' },
                component: (resolve) => require([`@/views/ems/details/OrderDetail.vue`], resolve),
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404', icon: 'product-add' },
        component: (resolve) => require([`@/views/404.vue`], resolve),
    },


]

const router = new VueRouter({
        routes
    })
    //动态绑定路由
router.beforeEach((to, from, next) => {

    let hasRouter = store.state.menu.hasRouter
    let token = localStorage.getItem("v2-token")
    if (to.path == '/login') {
        next()
    } else if (!token) {
        next({ path: '/login' })
    } else if (!hasRouter && token) {
        axios.get("/admin/nav", {
            headers: {
                Authorization: token
            }

        }).then(res => {


            //拿到menuList
            store.commit("SET_MENULIST", res.data.data.nav)

            //拿到用户权限
            store.commit("SET_PERMLIST", res.data.data.authority)
            var users = res.data.data.nav;

            //一级菜单排序
            users.sort(function(a, b) {
                return a.orderNum - b.orderNum;
            });
            // console.log(users)


            //动态绑定路由
            let newRouter = router.options.routes

            users.forEach(menu => {
                if (menu.children) {
                    //二级菜单排序
                    menu.children.sort(function(a, b) {
                        return a.orderNum - b.orderNum;
                    });

                    menu.children.forEach(e => {
                        //转换路由
                        let route = menuToRoter(e)

                        //把路由添加到路由管理中
                        if (route) {
                            newRouter[0].children.push(route)
                        }
                    })
                }
            })
            newRouter.push({ path: '*', redirect: '/404', hidden: true })
            router.addRoutes(newRouter)


            hasRouter = true
            store.commit("changeRouterStatus", hasRouter)

        })
    }



    next()
})

//method：路由转换器
const menuToRoter = (menu) => {
    if (!menu.component) {
        return null
    }
    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        },
        // component: (resolve) => require([`@/views${menu.component}`], resolve)
        component: (resolve) => require([`@/views/${menu.component}.vue`], resolve)
    }


    return route
}

export default router