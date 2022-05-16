<template>
  <div class="example">
    <BoxSelect class="select" node=".test" selectedClass=".test-select" @selectList="selectList">
      <div class="test"></div>
    </BoxSelect>
  </div>
</template>

<script setup lang="ts">
import BoxSelect from '@/components/box-select/index.vue'

const selectList = (selectList: Element[]) => {
  selectList.forEach(item => {
    item.classList.add('test-select')
  })
}
</script>

<style lang="scss" scoped>
.example {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  background-color: aqua;

  .test {
    margin: 20px;
    height: 20px;
    width: 20px;
    background-color: black;
  }

  .select {
    width: 100%;
    height: 100%;
    border: 1px solid rgb(146, 67, 67);
    // background-color: red;
  }

  .test-select {
    border: 1px solid red;
  }
}
</style>