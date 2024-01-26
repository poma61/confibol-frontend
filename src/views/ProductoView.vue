
<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInRight text-h6 my-3 pa-1 bg-yellow-darken-3 as-box-shadow">
            <v-icon icon="mdi-list-box-outline"></v-icon>&nbsp;Panel de productos
        </h1>
        <ContentProducto/>
    </MainApp>
</template>

<script>
import MainApp from '@/layouts/MainApp.vue';
import ContentProducto from '@/components/producto/ContentProducto.vue';
import { defineComponent } from 'vue';
export default defineComponent({
    components: {
        ContentProducto,
        MainApp
    }
});
</script>
