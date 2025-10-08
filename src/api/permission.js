import Mock from 'mockjs';

// 存储注册用户的数组
let registeredUsers = [
  // 预设的测试用户
  {
    id: 'admin-001',
    username: 'admin@example.com',
    password: '123456',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin',
    registerTime: '2024-01-01 00:00:00',
  },
  {
    id: 'user-001',
    username: 'user@example.com',
    password: '123456',
    name: 'User',
    email: 'user@example.com',
    role: 'user',
    registerTime: '2024-01-01 00:00:00',
  },
];

export default {
  getMenu: config => {
    const { username, password } = JSON.parse(config.body);

    // 在注册用户中查找匹配的用户
    const user = registeredUsers.find(
      u =>
        (u.username === username || u.email === username) &&
        u.password === password
    );

    if (!user) {
      return {
        code: 400,
        data: {
          msg: '用户名或密码错误',
        },
      };
    }

    // 根据用户角色返回不同的菜单
    if (user.role === 'admin') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              lable: '首页',
              icon: 'house',
              url: 'Home',
            },
            {
              path: '/goods',
              name: 'goods',
              lable: '商品管理',
              icon: 'goods',
              url: 'Goods',
            },
            {
              path: '/user',
              name: 'user',
              lable: '用户管理',
              icon: 'user',
              url: 'User',
            },
            {
              path: '/other',
              name: 'other',
              lable: '其他',
              icon: 'other',
              children: [
                {
                  path: '/page1',
                  name: 'page1',
                  lable: '页面1',
                  icon: 'page1',
                  url: 'Page1',
                },
                {
                  path: '/page2',
                  name: 'page2',
                  lable: '页面2',
                  icon: 'page2',
                  url: 'Page2',
                },
              ],
            },
          ],
          token: Mock.Random.guid(), // 返回一个随机的 GUID 作为 token
          msg: '登录成功',
        },
      };
    } else if (user.role === 'user') {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              lable: '首页',
              icon: 'house',
              url: 'Home',
            },

            {
              path: '/user',
              name: 'user',
              lable: '用户管理',
              icon: 'user',
            },
          ],
          token: Mock.Random.guid(), // 返回一个随机的 GUID 作为 token
          msg: '登录成功',
        },
      };
    } else {
      // 新注册的用户默认为普通用户权限
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: '/home',
              name: 'home',
              lable: '首页',
              icon: 'house',
              url: 'Home',
            },
            {
              path: '/user',
              name: 'user',
              lable: '用户管理',
              icon: 'user',
            },
          ],
          token: Mock.Random.guid(),
          msg: '登录成功',
        },
      };
    }
  },

  // 用户注册功能
  register: config => {
    const { name, email, password } = JSON.parse(config.body);

    // 验证必填字段
    if (!name || !email || !password) {
      return {
        code: 400,
        data: null,
        msg: '请填写所有必填字段',
      };
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        code: 400,
        data: null,
        msg: '请输入有效的邮箱地址',
      };
    }

    // 验证密码长度
    if (password.length < 6) {
      return {
        code: 400,
        data: null,
        msg: '密码长度至少6位',
      };
    }

    // 检查邮箱是否已存在
    const existingUser = registeredUsers.find(
      u => u.email === email || u.username === email
    );
    if (existingUser) {
      return {
        code: 400,
        data: null,
        msg: '该邮箱已被注册',
      };
    }

    // 创建新用户
    const newUser = {
      id: Mock.Random.guid(),
      username: email, // 使用邮箱作为用户名
      email: email,
      password: password,
      name: name,
      role: 'user', // 新用户默认为普通用户
      registerTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    // 添加到用户列表
    registeredUsers.push(newUser);

    console.log('新用户注册成功:', newUser);
    console.log('当前用户列表:', registeredUsers);

    return {
      code: 200,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        msg: '注册成功',
      },
    };
  },
};
