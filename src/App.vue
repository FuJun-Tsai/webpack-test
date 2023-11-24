<template>
  <nav>
    <span
    v-for="link in routerLinks"
    :key="link.path"
    >
      <router-link
      v-if="link.name !== '404'"
      :to="link.path"
      >
        {{ link.name }}
      </router-link>
    </span>
  </nav>
  <div class="box">
    <p style="flex: 0 0 132px">
      請假時通之人員：
    </p>
    <p class="member">
      <span v-for="item in member" :key="item.id">
        {{ item.id }}-{{ item.name }}
      </span>
    </p>
  </div>
  <div class="form">
    新增人員：
    <div>
      員工編號：
      <input type="text" v-model="newMemberId">
    </div>
    <div>
      員工姓名：
      <input type="text" v-model="newMemberName">
    </div>
    <div>
      <button @click="newMemberId = ''; newMemberName = ''">
        清除
      </button>
      <button @click="memberAdd">
        新增
      </button>
    </div>
  </div>
  <div class="test">
    <p>
      <a>契約資料</a>
      <span>|</span>
      <a>證照資料</a>
      <span>|</span>
      <a>教育訓練</a>
      <span>|</span>
      <a>考核歷程</a>
      <span>|</span>
      <a>獎懲明細</a>
    </p>
    <p>
      <a>眷屬資料</a>
      <span>|</span>
      <a>年資經歷</a>
      <span>|</span>
    </p>
  </div>
  <router-view/>
</template>
<script lang="ts" setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from '@/store/user';

interface userAuth {
  name: string,
  auth: string[]
}

const router = useRouter();
const axios: any = inject('axios');

const useUserStore = userStore();
const routerLinks = ref(router.getRoutes());

axios.get('http://localhost:3000/customer')
.then((res: any)=>{
  useUserStore.setAuth(res.data as userAuth);
  routerLinks.value = routerLinks.value.filter(item => {
    if(item.meta.auth !== undefined){
      return useUserStore.auth.includes(item.meta.auth as string);
    }
    return false;
  })
})

const member = ref([
  {id: '0001', name: '阿銀'},
  {id: '0002', name: '阿時'},
]);
const newMemberId = ref('');
const newMemberName = ref('');

const memberAdd = function(){
  if(newMemberId.value === '' || newMemberName.value === ''){
    return;
  }
  member.value.push({
    id: newMemberId.value,
    name: newMemberName.value
  });
  newMemberId.value = '';
  newMemberName.value = '';
}

</script>
<style lang="scss">
nav{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 12px;
}
p{
  margin: 0;
}
.box{
  padding: 12px;
  width: 200px;
  border: 1px solid black;
  margin: 0 auto 12px auto;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .member{
    span{
      display: inline-block;
      margin-right: 4px;
    }
  }
}
.form{
  width: 300px;
  margin: 0 auto;
}

.test{
  width: 340px;
  margin: 0 auto;
  font-size: 14px;
  p{
    display: flex;
    gap: 6px;
    span{
      flex: 0 0 1px;
    }
    a{
      flex: 0 0 20%;
      display: inline-block;
      text-align: center;
    }
  }
}
</style>
