

<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-deep-purple-lighten-1 as-box-shadow">
            <v-icon icon="mdi-account-group"></v-icon>&nbsp;Panel de clientes
        </h1>
        <v-card class="animate__animated animate__bounceInLeft mt-5" elevation="20">
            <v-tabs bg-color="blue-grey-lighten-1" stacked show-arrows color="blue-grey-lighten-4">
                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'la-paz' } }">
                    <v-icon icon="mdi-numeric-1-circle-outline" />
                    La Paz
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'santa-cruz' } }">
                    <v-icon icon="mdi-numeric-2-circle-outline" />
                    Santa cruz
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'chuquisaca' } }">
                    <v-icon icon="mdi-numeric-3-circle-outline" />
                    Chuquisaca
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'cochabamba' } }">
                    <v-icon icon="mdi-numeric-4-circle-outline" />
                    Cochabamba
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'potosi' } }">
                    <v-icon icon="mdi-numeric-5-circle-outline" />
                    Potosi
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'beni' } }">
                    <v-icon icon="mdi-numeric-6-circle-outline" />
                    Beni
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'pando' } }">
                    <v-icon icon="mdi-numeric-7-circle-outline" />
                    Pando
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'tarija' } }">
                    <v-icon icon="mdi-numeric-8-circle-outline" />
                    Tarija
                </v-tab>

                <v-tab :to="{ name: 'n-cliente', params: { ciudad: 'oruro' } }">
                    <v-icon icon="mdi-numeric-9-circle-outline" />
                    Oruro
                </v-tab>
            </v-tabs>

        </v-card>

        <ContentCliente ref="componentCliente" />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import ContentCliente from '@/components/cliente/ContentCliente.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
const componentCliente = ref(null)
const route = useRoute();

watch(() => route.params.ciudad, async (new_ciudad) => {
    componentCliente.value.witchParamsRoute(new_ciudad);
    await componentCliente.value.loadDataTable();
});

onMounted(async () => {
    componentCliente.value.witchParamsRoute(route.params.ciudad);
    await componentCliente.value.loadDataTable();
});
</script>

<!-- 
usamos witchParamsRoute para pasar parametros de la ruta porque segun  el ciclo de vida de vue y las rutas hay una desigualdad
para obtener los parametros de la ruta y genera inconsistencia en el sistema..por eso usamos mejor un watch y una funcion en vez de pasar
props al componente hijo
 -->
