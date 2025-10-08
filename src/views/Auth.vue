<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 左侧登录区域 -->
      <div class="auth-form-section" :class="{ active: !isSignUp }">
        <div class="form-content">
          <h2 class="form-title">Sign In</h2>

          <!-- 社交登录按钮 -->
          <div class="social-buttons">
            <button class="social-btn">
              <i class="fab fa-google"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-facebook-f"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-github"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-linkedin-in"></i>
            </button>
          </div>

          <p class="form-subtitle">or use your email password</p>

          <!-- 测试账号提示 -->
          <div class="test-accounts">
            <p class="test-title">测试账号:</p>
            <p class="test-account">管理员: admin@example.com / 123456</p>
            <p class="test-account">用户: user@example.com / 123456</p>
          </div>

          <!-- 登录表单 -->
          <form @submit.prevent="handleSignIn" class="auth-form">
            <div class="input-group">
              <input
                v-model="signInForm.email"
                type="email"
                placeholder="Email"
                class="form-input"
                required
              />
            </div>
            <div class="input-group">
              <input
                v-model="signInForm.password"
                type="password"
                placeholder="Password"
                class="form-input"
                required
              />
            </div>

            <a href="#" class="forgot-password">Forget Your Password?</a>

            <div class="submit-btn-container">
              <button type="submit" class="submit-btn">SIGN IN</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 右侧注册区域 -->
      <div class="auth-form-section" :class="{ active: isSignUp }">
        <div class="form-content">
          <h2 class="form-title">Create Account</h2>

          <!-- 社交注册按钮 -->
          <div class="social-buttons">
            <button class="social-btn">
              <i class="fab fa-google"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-facebook-f"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-github"></i>
            </button>
            <button class="social-btn">
              <i class="fab fa-linkedin-in"></i>
            </button>
          </div>

          <p class="form-subtitle">or use your email for registration</p>

          <!-- 注册表单 -->
          <form @submit.prevent="handleSignUp" class="auth-form">
            <div class="input-group">
              <input
                v-model="signUpForm.name"
                type="text"
                placeholder="Name"
                class="form-input"
                required
              />
            </div>
            <div class="input-group">
              <input
                v-model="signUpForm.email"
                type="email"
                placeholder="Email"
                class="form-input"
                required
              />
            </div>
            <div class="input-group">
              <input
                v-model="signUpForm.password"
                type="password"
                placeholder="Password"
                class="form-input"
                required
              />
            </div>

            <div class="submit-btn-container">
              <button type="submit" class="submit-btn">SIGN UP</button>
            </div>
          </form>
        </div>
      </div>

      <!-- 切换背景面板 -->
      <div class="toggle-panel" :class="{ 'move-right': isSignUp }">
        <div
          class="toggle-content"
          :class="{ 'toggle-left': !isSignUp, 'toggle-right': isSignUp }"
        >
          <!-- Sign Up 提示面板 -->
          <div v-if="!isSignUp" class="toggle-section toggle-section-left">
            <h2 class="toggle-title">Hello, Friend!</h2>
            <p class="toggle-text">
              Register with your personal details to use all of site features
            </p>
            <button @click="toggleMode" class="toggle-btn">SIGN UP</button>
          </div>

          <!-- Sign In 提示面板 -->
          <div v-else class="toggle-section toggle-section-right">
            <h2 class="toggle-title">Welcome Back!</h2>
            <p class="toggle-text">
              Enter your personal details to use all of site features
            </p>
            <button @click="toggleMode" class="toggle-btn">SIGN IN</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAllStoreData } from '@/stores';

const { proxy } = getCurrentInstance();
const store = useAllStoreData();

const router = useRouter();
const route = useRoute();
const isSignUp = ref(false);

// 根据路由设置初始状态
onMounted(() => {
  isSignUp.value = route.name === 'register';
});

// 监听路由变化
watch(
  () => route.name,
  newName => {
    isSignUp.value = newName === 'register';
  }
);

// 登录表单数据
const signInForm = reactive({
  email: '',
  password: '',
});

// 注册表单数据
const signUpForm = reactive({
  name: '',
  email: '',
  password: '',
});

// 切换登录/注册模式
const toggleMode = () => {
  const newRoute = isSignUp.value ? 'login' : 'register';
  router.push({ name: newRoute });
};

// 处理登录
const handleSignIn = async () => {
  try {
    // 基本验证
    if (!signInForm.email || !signInForm.password) {
      ElMessage.error('请填写所有必填字段');
      return;
    }

    if (!isValidEmail(signInForm.email)) {
      ElMessage.error('请输入有效的邮箱地址');
      return;
    }

    // 将email转换为username，因为后端API期望username字段
    const loginData = {
      username: signInForm.email,
      password: signInForm.password,
    };

    console.log('发送登录请求:', loginData);

    const response = await proxy.$api.getMenu(loginData);
    console.log('登录响应:', response);

    if (response && response.token) {
      // 保存token到localStorage
      localStorage.setItem('token', response.token);

      // 保存用户菜单数据到store
      if (response.menuList) {
        store.setMenuList(response.menuList);
        // 同时保存到localStorage，以便页面刷新后恢复
        localStorage.setItem('menuList', JSON.stringify(response.menuList));
      }

      // 保存用户信息
      const userInfo = {
        username: loginData.username,
        token: response.token,
        loginTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        loginLocation: '中国',
      };
      store.setUserInfo(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      ElMessage.success(response.msg || '登录成功！');

      // 登录成功后重置tags，避免出现空标签
      store.resetTags();

      router.push('/home');
    } else {
      ElMessage.error('登录失败，请检查用户名和密码');
    }
  } catch (error) {
    console.error('登录错误:', error);
    ElMessage.error(error.message || error || '登录失败，请稍后重试');
  }
};

// 处理注册
const handleSignUp = async () => {
  try {
    // 基本验证
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password) {
      ElMessage.error('请填写所有必填字段');
      return;
    }

    if (!isValidEmail(signUpForm.email)) {
      ElMessage.error('请输入有效的邮箱地址');
      return;
    }

    if (signUpForm.password.length < 6) {
      ElMessage.error('密码长度至少6位');
      return;
    }

    console.log('发送注册请求:', signUpForm);

    // 调用注册API
    const response = await proxy.$api.register({
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
    });

    console.log('注册响应:', response);

    if (response && response.user) {
      ElMessage.success(response.msg || '注册成功！');

      // 清空表单
      signUpForm.name = '';
      signUpForm.email = '';
      signUpForm.password = '';

      // 注册成功后自动切换到登录模式
      router.push({ name: 'login' });
    } else {
      ElMessage.error('注册失败，请稍后重试');
    }
  } catch (error) {
    console.error('注册错误:', error);
    ElMessage.error(error.message || error || '注册失败，请稍后重试');
  }
};

// 邮箱验证函数
const isValidEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 850px;
  max-width: 100%;
  min-height: 550px;
  display: flex;
}

.auth-form-section {
  position: relative;
  width: 50%;
  padding: 40px 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s ease-in-out;
  z-index: 2;
}

.auth-form-section.active {
  z-index: 3;
}

.form-content {
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 18px;
}

.social-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  color: #666;
}

.social-btn:hover {
  border-color: #512da8;
  color: #512da8;
  transform: translateY(-2px);
}

.form-subtitle {
  color: #666;
  font-size: 13px;
  margin-bottom: 15px;
}

.test-accounts {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
}

.test-title {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.test-account {
  font-size: 11px;
  color: #666;
  margin: 2px 0;
  font-family: monospace;
}

.auth-form {
  width: 100%;
}

.input-group {
  margin-bottom: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 18px;
  border: none;
  background: #eee;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  color: #333;
}

.form-input:focus {
  background: #e0e0e0;
  box-shadow: 0 0 0 2px rgba(81, 45, 168, 0.1);
}

.form-input::placeholder {
  color: #999;
  font-size: 14px;
}

.forgot-password {
  color: #666;
  font-size: 12px;
  text-decoration: none;
  margin-bottom: 25px;
  display: inline-block;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #512da8;
}

.submit-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.submit-btn {
  background: #512da8;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  min-width: 120px;
}

.submit-btn:hover {
  background: #4527a0;
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(81, 45, 168, 0.3);
}

/* 切换面板样式 */
.toggle-panel {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.toggle-panel.move-right {
  transform: translateX(-100%);
}

.toggle-content {
  background: #512da8;
  background: linear-gradient(135deg, #512da8 0%, #673ab7 100%);
  color: white;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  border-radius: 0 20px 20px 0;
}

.toggle-content.toggle-right {
  transform: translateX(50%);
  border-radius: 20px 0 0 20px;
}

.toggle-section {
  text-align: center;
  padding: 0 40px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
}

.toggle-section-left {
  right: 0;
}

.toggle-section-right {
  left: 0;
}

.toggle-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 18px;
}

.toggle-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 35px;
  opacity: 0.9;
}

.toggle-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 10px 35px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  min-width: 120px;
}

.toggle-btn:hover {
  background: white;
  color: #512da8;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-card {
    width: 100%;
    min-height: 100vh;
    border-radius: 0;
    flex-direction: column;
  }

  .auth-form-section {
    width: 100%;
    min-height: 50vh;
  }

  .toggle-panel {
    position: relative;
    width: 100%;
    height: 200px;
    left: 0;
    top: auto;
  }

  .toggle-content {
    left: 0;
    width: 100%;
    height: 100%;
  }

  .toggle-section {
    width: 100%;
  }

  .form-content {
    max-width: 280px;
  }
}
</style>
