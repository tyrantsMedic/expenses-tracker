<template>
  <h4>Your Balance</h4>
  <h1>{{ total }} PKR</h1>
</template>

<script>
export default {
  props: {
    total: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
h4,
h1 {
  margin: 0;
}
</style>
