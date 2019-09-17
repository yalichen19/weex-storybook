<template>
  <div class="wrapper">
    <text class="content">{{ title }}</text>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 2px 10px;
  border-radius: 4px;
  align-items: center;
  background: #f40;
}

.content {
  font-size: 30px;
  color: #fff;
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "type_1"
    },
  }
};
</script>