const Mock = require('mockjs')

let Result = {
    code: 200,
    msg: '着',
    data: null
}





Mock.mock('/sys/menu/nav', 'get', () => {
    let nav = [{
            title: '商品', //菜单标题
            name: 'Psm',
            icon: 'el-icon-shopping-bag-1',
            path: '', //路由跳转地址
            component: '',
            children: [{
                    title: '商品列表', //菜单标题
                    name: 'goods',
                    icon: 'el-icon-menu',
                    path: '/psm/goods', //路由跳转地址
                    component: '/psm/Goods',

                },
                {
                    title: '添加商品',
                    name: 'addGoods',
                    icon: 'el-icon-s-tools',
                    path: '/psm/addGoods',
                    component: '/psm/addGoods',

                },
                {
                    title: '商品分类',
                    name: 'goodsCate',
                    icon: 'el-icon-s-tools',
                    path: '/psm/goodsCate',
                    component: '/psm/GoodsCate',

                }
            ]
        }, {
            title: '订单', //菜单标题
            name: 'Osm',
            icon: 'el-icon-s-tools',
            path: '', //路由跳转地址
            component: '',
            children: [{
                title: '订单列表', //菜单标题
                name: 'order',
                icon: 'el-icon-s-tools',
                path: '/osm/order', //路由跳转地址
                component: '/osm/order',

            }]
        },

        {
            title: '系统管理', //菜单标题
            name: 'SysManga',
            icon: 'el-icon-s-platform',
            path: '', //路由跳转地址
            component: '',
            children: [{
                    title: '用户管理', //菜单标题
                    name: 'SmsUser',
                    icon: 'el-icon-s-custom',
                    path: '/sms/user', //路由跳转地址
                    component: '/sms/User',
                },
                {
                    title: ' 角色管理', //菜单标题
                    name: 'SmsAdmin',
                    icon: 'el-icon-user-solid',
                    path: '/sms/Role', //路由跳转地址
                    component: '/sms/Role',
                },
            ]
        },



        {
            title: '系统工具', //菜单标题
            name: 'SysTools',
            icon: 'el-icon-s-tools',
            path: '', //路由跳转地址
            component: '',
        }


    ]
    let authoristy = []

    Result.data = {
        nav: nav,

    }

    return Result
})

Mock.mock('/psm/CateList', 'get', () => {
    let list = [{
            id: "1",
            name: "wwdasd",
            level: "0",
            navStatus: "1",
            showStatus: "1",
            sort: "1",
        },
        {
            id: "2",
            name: "wwdasd",
            level: "1",
            navStatus: "1",
            showStatus: "1",
            sort: "1",
        },
        {
            id: "3",
            name: "wwdasd",
            level: "0",
            navStatus: "1",
            showStatus: "1",
            sort: "1",
        },
    ]

    Result.data = {
        list: list,
    }

    return Result
})

Mock.mock('/psm/getCateList', 'get', () => {
    let list = [{
        id: "7",
        name: "wwdasd",
        level: "1",
        navStatus: "1",
        showStatus: "1",
        sort: "1",
    }, ]

    Result.data = {
        list: list,
    }

    return Result
})