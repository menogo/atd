<template>
    <section>
        <li class="todo">
            <div class="todo-content">
                <div class="todo-info">
                    <label v-html="parseComments(todo.title)"></label>
                    <le-link type="primary" v-if="todo.url !== ''" :underline="false" :href="todo.url" target="_blank"
                        >查看结果</le-link
                    >
                </div>
                <div class="todo-time">
                    <label v-text="todo.time" />
                </div>
            </div>
        </li>
    </section>
</template>

<script>
export default {
    name: 'Todo',
    props: {
        todo: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {};
    },
    methods: {
        parseComments(value) {
            let exp = /\[(.+?)\]/;
            let tmp = value.replace(exp, item => {
                let tmpItem = item.slice(1, -1);
                let newVal = '<label class="text-strong">' + tmpItem + '</label>';

                return newVal;
            });

            return tmp;
        }
    }
};
</script>

<style></style>
