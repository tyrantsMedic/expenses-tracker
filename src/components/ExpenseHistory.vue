<template>
  <div v-if="transactions.length > 0">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
      :style="{ color: colorChangedToRed ? 'red' : 'black' }"
    >
      <h2>History</h2>
      <button @click="resetAllTransactions">Reset All</button>
    </div>
    <hr />
    <ul>
      <li v-for="transaction in transactions" :key="transaction.id">
        <div class="delete-icon" @click="deleteTransaction(transaction.id)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            />
          </svg>
        </div>
        <div class="history-container" :class="transaction.amount < 0 ? 'red' : 'green'">
          <p>{{ transaction.text }}</p>
          <p>{{ transaction.amount }} PKR</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  emits: ['deleteTransaction', 'resetTransactions'],
  props: {
    transactions: {
      type: Array,
      required: true
    },
    colorChangedToRed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    deleteTransaction(id) {
      this.$emit('deleteTransaction', id)
    },
    resetAllTransactions() {
      this.$emit('resetTransactions')
    }
  }
}
</script>

<style>
li {
  list-style: none;
  display: flex;
  align-items: center;
}

ul {
  padding: 0;
}

.history-container {
  display: flex;
  justify-content: space-between;
  box-shadow:
    rgba(0, 0, 0, 0.12) 0px 1px 3px,
    rgba(0, 0, 0, 0.24) 0px 1px 2px;
  background: white;
  padding: 0rem 1rem;
  width: 100%;
  margin-top: 10px;
}

p {
  font-weight: 500;
}

.red {
  border-right: 5px solid red;
}

.green {
  border-right: 5px solid rgb(1, 218, 1);
}

.delete-icon {
  display: none;
  background: red;
  width: 50px;
  cursor: pointer;
  height: 56px;
  position: relative;
  top: 5px;
}

.delete-icon svg {
  width: 25px;
  height: 25px;
}

svg path {
  fill: white;
}

li:hover .delete-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
