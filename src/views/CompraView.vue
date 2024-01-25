
<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-yellow-darken-3 as-box-shadow">
            <v-icon icon="mdi-cart"></v-icon>&nbsp;Compra
        </h1>
        <v-card class="my-5" elevation="10">
            <v-tabs class="animate__animated animate__bounceInRight" bg-color="light-blue-darken-3" stacked show-arrows color="light-blue-accent-1">
                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'la-paz' } }">
                    <v-icon icon="mdi-numeric-1-circle-outline" />
                    La Paz
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'santa-cruz' } }">
                    <v-icon icon="mdi-numeric-2-circle-outline" />
                    Santa cruz
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'chuquisaca' } }">
                    <v-icon icon="mdi-numeric-3-circle-outline" />
                    Chuquisaca
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'cochabamba' } }">
                    <v-icon icon="mdi-numeric-4-circle-outline" />
                    Cochabamba
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'potosi' } }">
                    <v-icon icon="mdi-numeric-5-circle-outline" />
                    Potosi
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'beni' } }">
                    <v-icon icon="mdi-numeric-6-circle-outline" />
                    Beni
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'pando' } }">
                    <v-icon icon="mdi-numeric-7-circle-outline" />
                    Pando
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'tarija' } }">
                    <v-icon icon="mdi-numeric-8-circle-outline" />
                    Tarija
                </v-tab>

                <v-tab :to="{ name: 'n-compra', params: { ciudad: 'oruro' } }">
                    <v-icon icon="mdi-numeric-9-circle-outline" />
                    Oruro
                </v-tab>

            </v-tabs>

           
        </v-card>
        <MainContentCompra ref="ComponentMainContentCompra" />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentCompra from '@/components/compra/MainContentCompra.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
const ComponentMainContentCompra = ref(null)
const route = useRoute();

watch(() => route.params.ciudad, async (new_ciudad) => {
    ComponentMainContentCompra.value.witchParamsRoute(new_ciudad);
    await ComponentMainContentCompra.value.loadDataTable();
});

onMounted(async () => {
    ComponentMainContentCompra.value.witchParamsRoute(route.params.ciudad);
    await ComponentMainContentCompra.value.loadDataTable();
});            
</script>
