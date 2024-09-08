<template>
    <h2>Add new transaction</h2>
    <hr />
    <form class="transaction-form" @submit.prevent="onSubmit">
        <label for="text">Text</label>
        <input type="text" for="text" v-model="form.text" />
        <label for="amount">Amount</label>
        <span>(Negative-expense, Positive-income)</span>
        <input type="number" for="amount" v-model="form.amount" />
        <button>Add Transaction</button>
    </form>
</template>

<script>
export default {
    emits: ["addTransaction", "isTextChangedToRed"],
    data() {
        return {
            form: {
                text: "",
                amount: "",
            },
        };
    },
    watch: {
        "form.text"(val) {
            if (val == "red") this.$emit("isTextChangedToRed", true);
            else this.$emit("isTextChangedToRed", false);
        },
    },
    methods: {
        onSubmit() {
            if (this.form.text == "" || this.form.amount == "") return;
            this.$emit("addTransaction", this.form);

            this.form = {
                text: "",
                amount: "",
            };
        },
    },
};
</script>

<style>
.transaction-form {
    display: flex;
    flex-direction: column;
}

input {
    height: 40px;
    margin: 10px 0px;
    border: 1px solid #e7e7e7;
    background: #fcfbfb;
}

input[type="text"]:focus {
    border: 1px solid #707070;
    outline: none;
}

button {
    background: rgb(172, 137, 236);
    padding: 0.5rem;
    border: none;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
}

button:hover {
    background: rgb(110, 88, 151);
}
</style>
