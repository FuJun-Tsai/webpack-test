import { defineStore } from 'pinia';
import { ref } from 'vue';

interface userAuth {
  name: string,
  auth: string[]
}

export const userStore = defineStore('user', ()=>{
  const name = ref<string>('');
  const auth = ref<string[]>([]);

  const setAuth = function(authData: userAuth){
    name.value = authData.name;
    auth.value = authData.auth;
  }

  return {
    name,
    auth,

    setAuth
  }
})
