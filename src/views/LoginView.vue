<template>
    <main class="as-content">
        <div class="animate__animated animate__jackInTheBox ma-5  as-login-card">
            <img class="as-card-item" :src="require('@/assets/images/logo-empresa.jpeg')" />

            <v-form @submit.prevent="login" class="pa-5 as-card-item">
                <h1 class="text-h5 text-center text-white">
                    Inicio de sesion
                </h1>
                <div>
                    <v-text-field v-model="user" :readonly="loading" class="mb-2" clearable label="Usuario"
                        placeholder="Escriba su usuario..." color="blue-darken-3"></v-text-field>
                </div>

                <div>
                    <v-text-field v-model="password" :readonly="loading" label="Contraseña"
                        placeholder="Escriba su contraseña..." color="blue-darken-3"
                        :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
                        autocomplete="off" @click:append-inner="show = !show"></v-text-field>
                </div>
                <div>
                    <v-btn :loading="loading" block color="blue-darken-3" size="large" type="submit" variant="elevated">
                        Ingresar
                    </v-btn>
                </div>
            </v-form>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/useAuth';
import toastify from '@/composables/toastify';
//data
const user = ref("");  
const password = ref("");
const loading = ref(false);
const router = useRouter();
const show = ref(false);
//methods 
const login = () => {
    loading.value = true;

    setTimeout(async () => {
        const auth = useAuth();
        const auth_success = await auth.login(user.value, password.value)
        if (auth_success.status) {
            router.push("/inicio");
           // toastify('info', auth_success.message);
        } else {
            toastify('danger', auth_success.message);
        }
        loading.value = false;

    }, 200);
}
</script>

<style scoped>
.as-content {
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(@/assets/images/ecommerce.jpg);
    background-size: cover;
    overflow: hidden !important;
    display: flex;
    justify-content: center;
    align-items: center;
}

.as-login-card {
    width: fit-content;
    background-color: rgba(255, 255, 255, 0.534);
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

}

.as-card-item {
    flex-grow: 1;
    min-width: 350px;
}

/*  estilos para la imagen */
.as-card-item:nth-child(1) {
    border-radius: 50px;
    height: 500px;
    width: 500px;
}

/* Para dispositivos con un ancho de pantalla máximo de 600px */
@media only screen and (max-width: 600px) {

    /*  estilos para la imagen */
    .as-card-item:nth-child(1) {
        height: 300px;
        width: 300px;
    }

}
</style>
