
const form = document.getElementById("form-registro");
const resultado = document.getElementById("msg"); // El <p> al final del form
const campos = ["user", "email", "pass", "conf", "resp"];

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-"+id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    /* Campo obligatorio */
    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    /* Validación de Patterns y tipos */
    if (input.validity.patternMismatch || input.validity.typeMismatch) {
        const mensajes = {
            user: "El usuario debe tener entre 3 y 20 letras (sin espacios).",
            email: "Introduce un correo electrónico válido.",
            pass: "Mínimo 8 caracteres, incluyendo una mayúscula, una minúscula y un número.",
            resp: "La respuesta debe tener entre 2 y 30 letras."
        };

        error.textContent = mensajes[id] || "Formato inválido";
        input.classList.add("invalido");
        return false;
    }

    /* Validación especial: Confirmar Contraseña */
    if (id === "reg-conf") {
        const pass = document.getElementById("reg-pass").value;
        if (input.value !== pass) {
            error.textContent = "Las contraseñas no coinciden.";
            input.classList.add("invalido");
            return false;
        }
    }

    input.classList.add("valido");
    return true;
}

/* Eventos en inputs */
campos.forEach(id => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("blur", () => validarCampo(id));
    input.addEventListener("input", () => {
        validarCampo(id);
        // Si escribes en la contraseña original, re-validar la confirmación
        if (id === "reg-pass") validarCampo("reg-conf");
    });
});

/* Submit */
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    let valido = true;

    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    if (!valido) {
        resultado.textContent = "Por favor, corrige los errores antes de enviar.";
        resultado.style.color = "red";
        return;
    }

    // Preparar datos para el servidor
    const datos = Object.fromEntries(new FormData(form));

    const response = await fetch("/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
    });

    const resultadoServidor = await response.json(); //recupera lo del controlador
    resultado.textContent =  JSON.stringify(resultadoServidor,null,2);
       
    
});