const form      = document.getElementById("form-registro");
const resultado = document.getElementById("msg");
const campos    = ["reg-user", "reg-email", "reg-pass", "reg-conf", "reg-resp"];

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    /* campo obligatorio */
    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    /* confirmar contraseña */
    if (id === "reg-conf") {
        const pass = document.getElementById("reg-pass");
        if (pass && input.value !== pass.value) {
            error.textContent = "Las contraseñas no coinciden";
            input.classList.add("invalido");
            return false;
        }
        input.classList.add("valido");
        return true;
    }

    /* pattern */
    if (input.validity.patternMismatch) {
        const mensajes = {
            "reg-user": "El usuario debe tener entre 3 y 20 letras (sin espacios ni números)",
            "reg-pass": "Mínimo 8 caracteres: una mayúscula, una minúscula y un número",
            "reg-resp": "La respuesta debe tener entre 2 y 30 letras"
        };

        error.textContent = mensajes[id] || "Formato inválido";
        input.classList.add("invalido");
        return false;
    }

    /* email */
    if (input.validity.typeMismatch) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }

    input.classList.add("valido");
    return true;
}

/* eventos en inputs */
campos.forEach(id => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("blur",  () => validarCampo(id));
    input.addEventListener("input", () => {
        validarCampo(id);
        if (id === "reg-pass") validarCampo("reg-conf");
    });
});

/* submit */
form.addEventListener("submit", async function(e) {
    let valido = true;
    e.preventDefault();
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    if (!valido) {
        return;
    }

    const datos = {
        Usuario:    document.getElementById("reg-user").value.trim(),
        correo:     document.getElementById("reg-email").value.trim(),
        contraseña: document.getElementById("reg-pass").value,
        pregunta:   form.querySelector("select[name='pregunta']").value,  
        respuesta:  document.getElementById("reg-resp").value.trim()
    };

    const response = await fetch("/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const resultadoServidor = await response.json();

    resultado.textContent = JSON.stringify(resultadoServidor, null, 2);
});
