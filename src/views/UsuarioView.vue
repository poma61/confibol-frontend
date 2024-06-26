<template>
    <MainApp>
        <h1 class="animate__animated animate__bounceInLeft text-h6 my-3 pa-1 bg-cyan-darken-1 as-box-shadow">
            <v-icon icon="mdi-account-circle-outline"></v-icon>&nbsp;Usuario
        </h1>
        <v-card class="animate__animated animate__bounceInLeft mt-5" elevation="20">
            <v-tabs bg-color="cyan-darken-1" stacked show-arrows color="cyan-lighten-4">
                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'la-paz' } }">
                    <v-icon icon="mdi-numeric-1-circle-outline" />
                    La Paz
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'santa-cruz' } }">
                    <v-icon icon="mdi-numeric-2-circle-outline" />
                    Santa cruz
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'chuquisaca' } }">
                    <v-icon icon="mdi-numeric-3-circle-outline" />
                    Chuquisaca
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'cochabamba' } }">
                    <v-icon icon="mdi-numeric-4-circle-outline" />
                    Cochabamba
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'potosi' } }">
                    <v-icon icon="mdi-numeric-5-circle-outline" />
                    Potosi
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'beni' } }">
                    <v-icon icon="mdi-numeric-6-circle-outline" />
                    Beni
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'pando' } }">
                    <v-icon icon="mdi-numeric-7-circle-outline" />
                    Pando
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'tarija' } }">
                    <v-icon icon="mdi-numeric-8-circle-outline" />
                    Tarija
                </v-tab>

                <v-tab :to="{ name: 'n-usuario', params: { ciudad: 'oruro' } }">
                    <v-icon icon="mdi-numeric-9-circle-outline" />
                    Oruro
                </v-tab>
            </v-tabs>

        </v-card>

        <ContentUsuario ref="componentUsuario" />
    </MainApp>
</template>

<script setup>
import MainApp from '@/layouts/MainApp.vue';
import ContentUsuario from '@/components/usuario/ContentUsuario.vue';
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router'
const componentUsuario = ref(null)
const route = useRoute();

// Función para asegurar que Todos los componentes DOM se hayan renderizado
const ensureDOMRendered = async () => {
    return new Promise((resolve) => {
        nextTick(() => {
            resolve();
        });
    });
};


watch(() => route.params.ciudad, async (new_ciudad, old_ciudad) => {
    await ensureDOMRendered();
    componentUsuario.value.witchParamsRoute(new_ciudad);
    //componentUsuario.value.handleComponent('data-table');
    await componentUsuario.value.changeDataIterator();
});

onMounted(async () => {
    await ensureDOMRendered();
    componentUsuario.value.witchParamsRoute(route.params.ciudad);
    // componentUsuario.value.handleComponent('data-table');
    await componentUsuario.value.changeDataIterator();

});
</script>

<!-- 
usamos witchParamsRoute para pasar parametros de la ruta porque segun  el ciclo de vida de vue y las rutas hay una desigualdad
para obtener los parametros de la ruta y genera inconsistencia en el sistema..por eso usamos mejor un watch y una funcion en vez de pasar
props al componente hijo
 -->
