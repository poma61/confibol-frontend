
<template>
    <MainApp>
        <v-card  elevation="24">
            <v-card-text>
                <div class="as-content-not-found">
                    <h1 class="text-h4 text-center">
                        NO SE PUEDE PROCESAR ESTA ACCIÓN. 
                    </h1>
                    <img :src="require('@/assets/images/page.png')" width="400" height="400"/>
                </div>
            </v-card-text>
        </v-card>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';

</script>

<style scoped>
.as-content-not-found{
    display: flex;
    width: 100%;
    height: 88vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
