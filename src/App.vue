<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <el-button @click="onClick">测试按钮</el-button>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
import { ElMessage } from 'element-plus'

const onClick = () => {
  ElMessage.success("按钮被点击了");
}
</script>

<style lang="scss">
@import '@/assets/css/reset.scss';

html,
body {
  background: transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: #111e2e;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@font-face {
  font-family: led;
  src: url('./assets/font/DS-DIGI.TTF');
}
</style>
