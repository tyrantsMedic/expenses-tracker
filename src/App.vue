<template>
  <div class="container">
    <h2>Expense Tracker</h2>
    <TotalBalance :total="total" />
    <IncomeExpense :income="income" :expense="expense" />
    <ExpenseHistory
      :transactions="transactions"
      :colorChangedToRed="colorChangedToRed"
      @deleteTransaction="onDeleteTransaction"
      @resetTransactions="onResetTransactions"
    />
    <TransactionForm
      @addTransaction="onAddTransaction"
      @isTextChangedToRed="onIsTextChangedToRed"
    />
  </div>
</template>

<script>
import TotalBalance from './components/TotalBalance.vue'
import IncomeExpense from './components/IncomeExpense.vue'
import ExpenseHistory from './components/ExpenseHistory.vue'
import TransactionForm from './components/TransactionForm.vue'

export default {
  components: {
    TotalBalance,
    IncomeExpense,
    ExpenseHistory,
    TransactionForm
  },
  data() {
    return {
      transactions: [],
      colorChangedToRed: false
    }
  },
  mounted() {
    if (localStorage.getItem('transactions') == null) {
      localStorage.setItem('transactions', [''])
    }
    if (localStorage.getItem('transactions') != '') {
      this.transactions = JSON.parse(localStorage.getItem('transactions'))
    }
  },
  computed: {
    income() {
      return this.transactions
        .reduce((total, transaction) => {
          if (transaction.amount > 0) total += transaction.amount
          return total
        }, 0)
        .toFixed(2)
    },
    expense() {
      return this.transactions
        .reduce((total, transaction) => {
          if (transaction.amount < 0) total += transaction.amount
          return total
        }, 0)
        .toFixed(2)
    },
    total() {
      return this.transactions
        .reduce((total, transaction) => (total += transaction.amount), 0)
        .toFixed(2)
    }
  },
  methods: {
    onAddTransaction(data) {
      this.transactions.push({
        id: this.generateUniqueID(),
        ...data
      })
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },
    generateUniqueID() {
      return Math.floor(Math.random() * 10000)
    },
    onDeleteTransaction(id) {
      this.transactions = this.transactions.filter((transaction) => transaction.id != id)
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },
    async onResetTransactions() {
      await localStorage.setItem('transactions', [''])
      this.transactions = []
    },
    onIsTextChangedToRed(isTextChangedToRed) {
      this.colorChangedToRed = isTextChangedToRed
    }
  }
}
</script>
