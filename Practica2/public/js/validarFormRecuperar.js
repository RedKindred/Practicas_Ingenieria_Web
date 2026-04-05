let usuarioEncontrado = "";

// ── Paso 1: buscar usuario ────────────────────────────────────────────────────
async function buscarUsuario() {
    const inputUser = document.getElementById("buscar-email");
    const errorUser = document.getElementById("error-buscar-email");
    const resultado = document.getElementById("resultado");

    errorUser.textContent = "";
    resultado.textContent = "";
    inputUser.classList.remove("valido", "invalido");

    const usuario = inputUser.value.trim();

    if (!usuario) {
        errorUser.textContent = "Este campo es obligatorio";
        inputUser.classList.add("invalido");
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(usuario)) {
        errorUser.textContent = "Correo electrónico inválido";
        inputUser.classList.add("invalido");
        return;
    }

    inputUser.classList.add("valido");

    const res  = await fetch("/recuperar/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: usuario })
    });

    const data = await res.json();

    if (data.ok) {
        usuarioEncontrado = usuario;
        document.getElementById("pregunta-mostrada").textContent = data.pregunta;
        document.getElementById("paso-1").style.display = "none";
        document.getElementById("paso-2").style.display = "block";

        // ✅ Agregar eventos del paso 2 una vez que es visible
        agregarEventosPaso2();
    } else {
        resultado.textContent = data.mensaje;
        resultado.style.color = "red";
    }
}

// ── Paso 2: validar respuesta ─────────────────────────────────────────────────
async function validarRespuesta() {
    const inputResp = document.getElementById("respuesta-user");
    const errorResp = document.getElementById("error-respuesta-user");
    const resultado = document.getElementById("resultado");

    errorResp.textContent = "";
    resultado.textContent = "";
    inputResp.classList.remove("valido", "invalido");

    const respuesta = inputResp.value.trim();

    if (!respuesta) {
        errorResp.textContent = "Este campo es obligatorio";
        inputResp.classList.add("invalido");
        return;
    }

    if (respuesta.length < 2) {
        errorResp.textContent = "La respuesta debe tener al menos 2 caracteres";
        inputResp.classList.add("invalido");
        return;
    }

    inputResp.classList.add("valido");

    const res  = await fetch("/recuperar/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: usuarioEncontrado, respuesta })
    });

    const data = await res.json();

    if (data.ok) {
        resultado.textContent = data.mensaje;
        resultado.style.color = "green";
        document.getElementById("paso-2").style.display = "none";
        document.getElementById("paso-3").style.display = "block";

        // ✅ Agregar eventos del paso 3 una vez que es visible
        agregarEventosPaso3();
    } else {
        resultado.textContent = data.mensaje;
        resultado.style.color = "red";
    }
}

// ── Paso 3: cambiar contraseña ────────────────────────────────────────────────
async function cambiarContrasena() {
    const inputPass = document.getElementById("nueva-pass");
    const inputConf = document.getElementById("nueva-conf");
    const errorPass = document.getElementById("error-nueva-pass");
    const errorConf = document.getElementById("error-nueva-conf");
    const resultado = document.getElementById("resultado");

    errorPass.textContent = "";
    errorConf.textContent = "";
    resultado.textContent = "";
    inputPass.classList.remove("valido", "invalido");
    inputConf.classList.remove("valido", "invalido");

    let valido = true;

    if (!inputPass.value) {
        errorPass.textContent = "Este campo es obligatorio";
        inputPass.classList.add("invalido");
        valido = false;
    } else if (inputPass.validity.patternMismatch) {
        errorPass.textContent = "Mínimo 8 caracteres: una mayúscula, una minúscula y un número";
        inputPass.classList.add("invalido");
        valido = false;
    } else {
        inputPass.classList.add("valido");
    }

    if (!inputConf.value) {
        errorConf.textContent = "Este campo es obligatorio";
        inputConf.classList.add("invalido");
        valido = false;
    } else if (inputConf.value !== inputPass.value) {
        errorConf.textContent = "Las contraseñas no coinciden";
        inputConf.classList.add("invalido");
        valido = false;
    } else {
        inputConf.classList.add("valido");
    }

    if (!valido) return;

    const res  = await fetch("/recuperar/cambiar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: usuarioEncontrado, nuevaContrasena: inputPass.value })
    });

    const data = await res.json();

    resultado.textContent = data.mensaje;
    resultado.style.color = data.ok ? "green" : "red";

    if (data.ok) {
        document.getElementById("paso-3").style.display = "none";
    }
}

// ── Eventos en tiempo real ────────────────────────────────────────────────────

// Paso 1 — se registra al cargar la página porque el input ya es visible
document.getElementById("buscar-email").addEventListener("blur",  validarPaso1);
document.getElementById("buscar-email").addEventListener("input", validarPaso1);

function validarPaso1() {
    const input = document.getElementById("buscar-email");
    const error = document.getElementById("error-buscar-email");
    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (!input.value.trim()) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
    } else if (!/^\S+@\S+\.\S+$/.test(input.value.trim())) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
    } else {
        input.classList.add("valido");
    }
}

// Paso 2 — se registra cuando el paso 2 se hace visible
function agregarEventosPaso2() {
    const input = document.getElementById("respuesta-user");
    input.addEventListener("blur",  validarPaso2);
    input.addEventListener("input", validarPaso2);
}

function validarPaso2() {
    const input = document.getElementById("respuesta-user");
    const error = document.getElementById("error-respuesta-user");
    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (!input.value.trim()) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
    } else if (input.value.trim().length < 2) {
        error.textContent = "La respuesta debe tener al menos 2 caracteres";
        input.classList.add("invalido");
    } else {
        input.classList.add("valido");
    }
}

// Paso 3 — se registra cuando el paso 3 se hace visible
function agregarEventosPaso3() {
    const inputPass = document.getElementById("nueva-pass");
    const inputConf = document.getElementById("nueva-conf");

    inputPass.addEventListener("blur",  validarNuevaPass);
    inputPass.addEventListener("input", () => {
        validarNuevaPass();
        validarConfPass(); // re-validar confirmación al cambiar la contraseña
    });

    inputConf.addEventListener("blur",  validarConfPass);
    inputConf.addEventListener("input", validarConfPass);
}

function validarNuevaPass() {
    const input = document.getElementById("nueva-pass");
    const error = document.getElementById("error-nueva-pass");
    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (!input.value) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
    } else if (input.validity.patternMismatch) {
        error.textContent = "Mínimo 8 caracteres: una mayúscula, una minúscula y un número";
        input.classList.add("invalido");
    } else {
        input.classList.add("valido");
    }
}

function validarConfPass() {
    const input = document.getElementById("nueva-conf");
    const pass  = document.getElementById("nueva-pass");
    const error = document.getElementById("error-nueva-conf");
    error.textContent = "";
    input.classList.remove("valido", "invalido");

    if (!input.value) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
    } else if (input.value !== pass.value) {
        error.textContent = "Las contraseñas no coinciden";
        input.classList.add("invalido");
    } else {
        input.classList.add("valido");
    }
}
