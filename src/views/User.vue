<script setup>
import { computed, ref, getCurrentInstance, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();

const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const isAddMode = ref(true); //true表示新增，false表示编辑

const getUserData = async (params = {}) => {
  const requestParams = {
    page: currentPage.value,
    limit: pageSize.value,
    ...params,
  };
  let data = await proxy.$api.getUserData(requestParams);
  tableData.value = data.list.map(item => ({
    ...item,
    sex: item.sex === 1 ? '男' : '女',
  }));
  total.value = data.count;
};
//初始化表单数据
const form = reactive({
  id: '',
  name: '',
  age: '',
  sex: '',
  addr: '',
  birth: '',
});
//编辑
const handleEdit = (index, val) => {
  Object.assign(form, { ...val }); // 将 val 的值复制到 form 对象中
  dialogVisible.value = true;
  isAddMode.value = false;
};
//新增
const handleAdd = () => {
  dialogVisible.value = true;
  isAddMode.value = true;
  resetForm();
};
//重置表单数据
const resetForm = () => {
  form.id = '';
  form.name = '';
  form.age = '';
  form.sex = '';
  form.addr = '';
  form.birth = '';
};
//提交表单
const handleSubmit = async () => {
  if (!form.name || !form.age || !form.sex) {
    ElMessage.warning('请填写必填项');
    return;
  }

  try {
    if (isAddMode.value) {
      await proxy.$api.addUser({
        name: form.name,
        age: form.age,
        sex: form.sex === '男' ? 1 : 0, // 存储为数字
        addr: form.addr,
        birth: form.birth,
      });
      ElMessage.success('新增成功');
    } else {
      await proxy.$api.editUser({
        id: form.id,
        name: form.name,
        age: form.age,
        sex: form.sex === '男' ? 1 : 0,
        addr: form.addr,
        birth: form.birth,
      });
      ElMessage.success('编辑成功');
    }

    dialogVisible.value = false;
    getUserData(); // 刷新表格
  } catch (error) {
    ElMessage.error('操作失败');
  }
};
const tableLable = reactive([
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'sex', label: '性别' },
  { prop: 'addr', label: '地址', width: '300' },
  { prop: 'birth', label: '出生日期', width: '300' },
]);
const formInline = reactive({
  keyWord: '',
});
const handlePageChange = page => {
  currentPage.value = page;
  const parmas = {};
  if (formInline.keyWord) {
    parmas.name = formInline.keyWord;
  }
  getUserData(parmas); // 调用getUserData函数，传入参数parmas
};
const handleSearch = () => {
  const parmas = {}; // 定义一个空对象 parmas，用于存储查询参数
  if (formInline.keyWord) {
    // 检查 formInline 中是否存在 keyWord 属性
    parmas.name = formInline.keyWord; // 如果存在，将 keyWord 的值赋给 parmas 对象的 name 属性
  }
  getUserData(parmas); // 调用 getUserData 函数，并将 parmas 作为参数传入
};
const handleDelete = (index, val) => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示').then(() => {
    // 直接在前端删除，不依赖后端API
    const originalLength = tableData.value.length;

    //通过ID删除（如果ID存在）
    if (val.id) {
      tableData.value = tableData.value.filter(item => item.id !== val.id);
    } else {
      //通过索引删除（如果ID不存在）
      tableData.value.splice(index, 1);
    }

    // 检查是否真的删除了
    if (tableData.value.length < originalLength) {
      // 更新总数
      total.value = Math.max(0, total.value - 1);

      ElMessage({
        showClose: true,
        type: 'success',
        message: '删除成功!',
      });

      console.log('删除成功，当前表格数据条数:', tableData.value.length);

      // 如果当前页没有数据了，跳转到上一页
      if (tableData.value.length === 0 && currentPage.value > 1) {
        currentPage.value = currentPage.value - 1;
        getUserData();
      }
    } else {
      ElMessage.error('删除失败，未找到对应记录!');
    }
  });
};
onMounted(() => {
  // onMounted 是 Vue 生命周期钩子，在组件挂载后执行
  getUserData(); // 组件挂载后，调用 getUserData 函数获取初始数据
});
</script>
<template>
  <div class="headerSearch">
    <el-button type="primary" @click="handleAdd"> +新增 </el-button>
    <el-dialog
      v-model="dialogVisible"
      :title="isAddMode ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年龄" required>
          <el-input v-model="form.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.addr" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
    <el-form :model="formInline" :inline="true" @submit.prevent class="search">
      <el-form-item>
        <el-input
          v-model="formInline.keyWord"
          placeholder="请输入用户名"
          class="input"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch"> 搜索 </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="tableContainer">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableLable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : '120'"
      />
      <el-table-column>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            Edit
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      class="pagination"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
<style scoped lang="less">
.headerSearch {
  display: flex;
  justify-content: space-between;
  height: 32px;
  margin: 10px 0 10px 0;
  .search {
    display: flex;
    justify-content: right;
    gap: 10px;
  }
}
.input {
  width: 200px;
}
.el-form-item {
  margin-right: 0;
}
.tableContainer {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .pagination {
    display: flex;
    justify-content: right;
    margin: 5px 5px;
  }
}
</style>
