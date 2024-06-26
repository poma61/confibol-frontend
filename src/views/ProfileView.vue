<template>
    <MainApp>

        <h1 class="text-h6 my-3 pa-1 bg-teal-accent-4 as-box-shadow ">
            <v-icon icon="mdi-account-eye"></v-icon>&nbsp;Perfil de usuario
        </h1>
        <v-card min-height="85vh" elevation="15" class="animate__animated animate__fadeInDown">
            <p class="ma-5 text-primary">
                Para actualizar los datos nombres, apellidos y otros debe comunicarse con el administrador del
                sistema.
                En caso de que se olvido su contraseña debe comunicarse con el administrador del sistema para
                restablecer la contraseña y/o solicitar un nuevo usuario.
            </p>
            <v-card-text class="as-flex-profile" v-if="loading_profile == false">

                <v-table density="compact" class="as-item-profile">
                    <tbody>
                        <tr>
                            <td colspan="2">
                                <div class="text-center ma-2">
                                    <v-avatar :image="app.BASE_URL + is_user.foto" size="200" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="text-center text-h6">Datos generales</td>
                        </tr>
                        <tr>
                            <th>Nombres:</th>
                            <td>{{ is_user.nombres }}</td>
                        </tr>

                        <tr>
                            <th>Apellido paterno:</th>
                            <td>{{ is_user.apellido_paterno }}</td>
                        </tr>

                        <tr>
                            <th>Apellido materno:</th>
                            <td>{{ is_user.apellido_materno }}</td>
                        </tr>
                        <tr>
                            <th>CI.:</th>
                            <td>{{ is_user.ci }} {{ is_user.ci_expedido }}</td>
                        </tr>
                        <tr>
                            <th>N° de contacto:</th>
                            <td v-if="is_user.n_de_contacto != null">{{ is_user.n_de_contacto }}</td>
                            <td v-else class="text-warning">Sin numero de contacto!</td>
                        </tr>
                        <tr>
                            <th>Correo electronico:</th>
                            <td v-if="is_user.correo_electronico != null">{{ is_user.correo_electronico }}</td>
                            <td v-else class="text-warning">Sin correo electronico!</td>
                        </tr>
                        <tr>
                            <th>Dirección:</th>
                            <td v-if="is_user.direccion != null">{{ is_user.direccion }}</td>
                            <td v-else class="text-warning">Sin dirección!</td>
                        </tr>
                        <tr>
                            <th>Rol:</th>
                            <td>{{ is_user.rol_name }}</td>
                        </tr>

                    </tbody>
                </v-table>

                <v-form @submit.prevent="saveCredentials" class="as-item-profile">
                    <h6 class="text-h6 text-center my-2">
                        Credenciales de acceso
                    </h6>
                    <v-text-field v-model="credentials.user" :readonly="loading_save_credentials" class="mb-2" clearable
                        prepend-inner-icon='mdi-account' label="Usuario" placeholder="Escriba su usuario..."
                        color="blue-darken-3" :error-messages="showErrorsFields('user')" />

                    <v-text-field v-model="credentials.old_password" :readonly="loading_save_credentials"
                        label="Contraseña antigua" placeholder="Escriba su contraseña..." color="blue-darken-3"
                        prepend-inner-icon='mdi-lock' :append-inner-icon="show_old_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_old_password ? 'text' : 'password'" autocomplete="off"
                        @click:append-inner="show_old_password = !show_old_password"
                        :error-messages="showErrorsFields('old_password')" />

                    <v-text-field v-model="credentials.new_password" :readonly="loading_save_credentials"
                        prepend-inner-icon='mdi-lock' label="Nueva contraseña" placeholder="Escriba su contraseña..."
                        color="blue-darken-3" :append-inner-icon="show_new_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_new_password ? 'text' : 'password'" autocomplete="off"
                        @click:append-inner="show_new_password = !show_new_password"
                        :error-messages="showErrorsFields('new_password')" />

                    <v-text-field v-model="credentials.confirm_new_password" :readonly="loading_save_credentials"
                        prepend-inner-icon='mdi-lock' label="Confirmar contraseña" placeholder="Escriba su contraseña..."
                        color="blue-darken-3" :append-inner-icon="show_confirm_new_password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_confirm_new_password ? 'text' : 'password'" autocomplete="off"
                        @click:append-inner="show_confirm_new_password = !show_confirm_new_password"
                        :error-messages="showErrorsFields('confirm_new_password')" />

                    <div class="text-center">
                        <v-btn :loading="loading_save_credentials" color="blue-darken-3" size="large" type="submit"
                            variant="elevated">
                            <v-icon icon="mdi-checkbox-marked" />&nbsp;Actualizar credenciales
                        </v-btn>
                    </div>

                </v-form>

            </v-card-text>
        </v-card>

        <v-overlay v-model="loading_profile" class="d-flex align-center justify-center">
            <div class="text-center">
                <v-progress-circular color="teal-accent-4" indeterminate size="100"></v-progress-circular>
                <p class="text-h6 text-white">Obteniendo datos del usuario...</p>
            </div>
        </v-overlay>

    </MainApp>
</template>

<script setup>
import app from '@/config/app';
import MainApp from '@/layouts/MainApp.vue';
import { useAuth } from '@/stores/useAuth';
import { onMounted, ref, computed } from 'vue';
import toastify from '@/composables/toastify';

//data
const is_user = ref({});
const loading_profile = ref(false);
const loading_save_credentials = ref(false);
const credentials = ref({
    user: "",
    old_password: "",
    new_password: "",
    confirm_new_password: "",
});
const errors_field = ref({});
const show_new_password = ref(false);
const show_old_password = ref(false);
const show_confirm_new_password = ref(false);

const showErrorsFields = computed(() => {
    return function (property) {
        if (errors_field.value[property]) {
            return errors_field.value[property][0];
        }
        return "";
    };
})

//methods
const auth = () => {
    loading_profile.value = true;
    setTimeout(async () => {
        const auth = useAuth();
        const response = await auth.user();
        loading_profile.value = false;
        if (response.status) {
            is_user.value = response.record;
            credentials.value.user = response.record.user;
        } else {
            toastify('danger', response.message);
        }
    }, 100);
};

const saveCredentials = () => {
    loading_save_credentials.value = true;
    setTimeout(async () => {
        const is_user = useAuth();
        const response = await is_user.updateCredentials(Object.assign({}, credentials.value));
        loading_save_credentials.value = false;
        if (response.status) {
            clear()
            toastify('success', response.message);
        } else {
            if (response.message_errors != undefined) {
                errors_field.value = response.message_errors;
            }
            toastify('danger', response.message);
        }
    }, 100);
}
const clear = () => {
    errors_field.value = {};
    credentials.value.old_password = "";
    credentials.value.new_password = "";
    credentials.value.confirm_new_password = "";
};

onMounted(() => {
    auth();
});

</script>

<style scoped>
.as-flex-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.as-flex-profile .as-item-profile {
    width: 500px;
}

@media only screen and (max-width:1200px) {
    .as-flex-profile .as-item-profile {
        width: 400px;
    }
}
</style>