

<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-teal-accent-4 as-box-shadow">
            <v-icon icon="mdi-store"></v-icon>&nbsp;Depositos
        </h1>
        <v-card class="animate__animated animate__bounceInRight">
            <v-tabs bg-color="cyan-darken-1"  stacked show-arrows color="light-blue-darken-4">
                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'la-paz' } }">
                    <v-icon icon="mdi-numeric-1-circle-outline" />
                    La Paz
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'santa-cruz' } }">
                    <v-icon icon="mdi-numeric-2-circle-outline" />
                    Santa cruz
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'chuquisaca' } }">
                    <v-icon icon="mdi-numeric-3-circle-outline" />
                    Chuquisaca
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'cochabamba' } }">
                    <v-icon icon="mdi-numeric-4-circle-outline" />
                    Cochabamba
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'potosi' } }">
                    <v-icon icon="mdi-numeric-5-circle-outline" />
                    Potosi
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'beni' } }">
                    <v-icon icon="mdi-numeric-6-circle-outline" />
                    Beni
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'pando' } }">
                    <v-icon icon="mdi-numeric-7-circle-outline" />
                    Pando
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'tarija' } }">
                    <v-icon icon="mdi-numeric-8-circle-outline" />
                    Tarija
                </v-tab>

                <v-tab :to="{ name: 'n-deposito', params: { ciudad: 'oruro' } }">
                    <v-icon icon="mdi-numeric-9-circle-outline" />
                    Oruro
                </v-tab>

            </v-tabs>

            <MainContentDeposito ref="tableDepositoComponent" />
        </v-card>
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import MainContentDeposito from '@/components/deposito/MainContentDeposito.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
const tableDepositoComponent = ref(null)
const route = useRoute();

watch(() => route.params.ciudad, async (new_ciudad) => {
    tableDepositoComponent.value.witchParamsRoute(new_ciudad);
    await tableDepositoComponent.value.loadDataTable();
});

onMounted(async () => {
    tableDepositoComponent.value.witchParamsRoute(route.params.ciudad);
    await tableDepositoComponent.value.loadDataTable();
});
</script>

<!-- 
usamos witchParamsRoute para pasar parametros de la ruta porque segun  el ciclo de vida de vue y las rutas hay una desigualdad
para obtener los parametros de la ruta y genera inconsistencia en el sistema..por eso usamos mejor un watch y una funcion en vez de pasar
props al componente hijo
 -->
